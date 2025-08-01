import { useQuery } from '@tanstack/react-query';
import { MsgExecuteContractEncodeObject } from '@cosmjs/cosmwasm-stargate';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { toUtf8 } from '@cosmjs/encoding';
import useWallet from '@/hooks/useWallet';
import { useMarketCollateralPrice, useMarketDebtPrice, useManagedMarket } from '@/hooks/useManaged';
import contracts from '@/config/contracts.json';
import { num } from '@/helpers/num';
import BigNumber from 'bignumber.js';
import useManagedAction, { ManagedActionState } from './useManagedMarketState';
import { queryClient } from '@/pages/_app';
import useSimulateAndBroadcast from '@/hooks/useSimulateAndBroadcast';
import { shiftDigits } from '@/helpers/math';
import { Asset } from '@/helpers/chain';


const useBorrowAndBoost = ({
  marketContract,
  asset,
  managedActionState,
  maxBorrowLTV,
  run = true,
}: {
  marketContract: string;
  asset: Asset;
  managedActionState: ManagedActionState;
  maxBorrowLTV: number;
  run?: boolean;
}) => {
  const { address } = useWallet();
  const { data: collateralPriceData } = useMarketCollateralPrice(marketContract, asset?.base);
  const { data: debtPriceData } = useMarketDebtPrice(marketContract);
  const { data: marketParams } = useManagedMarket(marketContract, asset?.base);
  const { setManagedActionState } = useManagedAction();

  type QueryData = {
    msgs: MsgExecuteContractEncodeObject[],
    debtAmount: string,
  }
  const { data: queryData } = useQuery<QueryData>({
    queryKey: [
      'borrowAndBoost_msgs',
      address,
      marketContract,
      asset,
      managedActionState,
      collateralPriceData,
      debtPriceData,
      marketParams,
      run,
    ],
    queryFn: () => {
      if (
        !run ||
        !address ||
        !asset ||
        !marketParams ||
        !collateralPriceData?.price ||
        !debtPriceData?.price ||
        !managedActionState.collateralAmount ||
        !managedActionState.multiplier
      ) {
        return { msgs: [], debtAmount: '0' };
      }

      // Calculate LTV from multiplier: multiplier = 1 / (1 - LTV) => LTV = 1 - 1/multiplier
      var loopLTV = 1 - 1 / managedActionState.multiplier;
      if (loopLTV > maxBorrowLTV) {
        loopLTV = maxBorrowLTV;
      }
      // Collateral value in USD
      const collateralValue = num(managedActionState.collateralAmount).times(collateralPriceData.price);
      console.log("collateralValue", collateralValue.toString(), managedActionState.collateralAmount, collateralPriceData.price);
      // Borrow amount in debt token units
      const borrowAmount = shiftDigits(collateralValue.times(loopLTV).div(debtPriceData.price).toString(), 6).toFixed(0);

      // Collateral value fee to executor: min($1, 1% of collateral value)
      const feeToExecutor = BigNumber.min(new BigNumber(1), collateralValue.times(0.01));

      // Convert TP/SL price to LTV
      let takeProfitLTV: string | undefined = undefined;
      let stopLossLTV: string | undefined = undefined;
      const collateralAmount = num(managedActionState.collateralAmount);
      // const currentCollateralPrice = num(collateralPriceData.price);
      const currentDebtPrice = num(debtPriceData.price);
      const borrowAmountValue = borrowAmount;

      if (managedActionState.takeProfit) {
        const tpPrice = num(managedActionState.takeProfit);
        // LTV = (debt_price * debt_amount) / (tpPrice * collateralAmount)
        takeProfitLTV = num(borrowAmountValue).times(currentDebtPrice).div(tpPrice.times(collateralAmount)).toString();
      }
      if (managedActionState.stopLoss) {
        const slPrice = num(managedActionState.stopLoss);
        // LTV = (debt_price * debt_amount) / (slPrice * collateralAmount)
        stopLossLTV = num(borrowAmountValue).times(currentDebtPrice).div(slPrice.times(collateralAmount)).toString();
      }

      // console.log("deposit amount", shiftDigits(managedActionState.collateralAmount, asset.decimal).toFixed(0));

      // Prepare Deposit message
      const depositMsg: MsgExecuteContractEncodeObject = {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: address,
          contract: marketContract,
          msg: toUtf8(
            JSON.stringify({
              supply_collateral: { }})
          ),
          funds: [
            {
              denom: asset.base,
              amount: shiftDigits(managedActionState.collateralAmount, asset.decimal).toFixed(0),
            },
          ],
        }),
      };

      // Prepare Borrow message
      // const borrowMsg: MsgExecuteContractEncodeObject = {
      //   typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
      //   value: MsgExecuteContract.fromPartial({
      //     sender: address,
      //     contract: marketContract,
      //     msg: toUtf8(
      //       JSON.stringify({
      //         borrow: {
      //           collateral_denom: collateralDenom,
      //           send_to: undefined,
      //           borrow_amount: {
      //             amount: borrowAmount.toString(),
      //             ltv: undefined,
      //           },
      //         },
      //       })
      //     ),
      //     funds: [],
      //   }),
      // };
      console.log("borrowAmount", borrowAmount.toString());


      // Prepare EditUXBoosts message
      const editUXBoostsMsg: MsgExecuteContractEncodeObject = {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: address,
          contract: marketContract,
          msg: toUtf8(
            JSON.stringify({
              edit_u_x_boosts: {
                collateral_denom: asset.base,
                // loop_ltv: loopLTV ? loopLTV.toString() : undefined,
                loop_ltv: loopLTV ? { 
                  loop_ltv: loopLTV.toString(), 
                  perpetual: false 
                } : undefined,
                take_profit_params: takeProfitLTV
                  ? {
                      ltv: takeProfitLTV,
                      percent_to_close: '1',
                      send_to: undefined,
                      perpetual: false,
                    }
                  : null,
                stop_loss_params: stopLossLTV
                  ? {
                      ltv: stopLossLTV,
                      percent_to_close: '1',
                      send_to: undefined,
                      perpetual: false,
                    }
                  : null,
                collateral_value_fee_to_executor: feeToExecutor.toFixed(2),
              },
            })
          ),
          funds: [],
        }),
      };


      // Prepare Loop Position message
      const loopPositionMsg: MsgExecuteContractEncodeObject = {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: MsgExecuteContract.fromPartial({
          sender: address,
          contract: marketContract,
          msg: toUtf8(
            JSON.stringify({
              loop_position: {
                collateral_denom: asset.base,
                position_owner: address,
              },
            })
          ),
          funds: [],
        }),
      };


      return { msgs: [depositMsg, editUXBoostsMsg, loopPositionMsg], debtAmount: borrowAmount };
    },
    enabled: !!address && !!marketParams && !!collateralPriceData?.price && !!debtPriceData?.price && !!managedActionState.collateralAmount && !!managedActionState.multiplier && run,
  });



  const msgs = queryData?.msgs ?? []
  const debtAmount = queryData?.debtAmount ?? '0'

  const onInitialSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['positions'] })
    queryClient.invalidateQueries({ queryKey: ['osmosis balances'] })
    //setManagedActionState to 0s
    setManagedActionState({
      ...managedActionState,
      collateralAmount: '',
      multiplier: 1,
      takeProfit: '',
      stopLoss: '',
    })
  }

  return {
    action: useSimulateAndBroadcast({
      msgs,
      queryKey: ['borrowAndBoost_msg_sim', (msgs?.toString() ?? "0")],
      onSuccess: onInitialSuccess,
      enabled: !!msgs?.length,
    }),
    debtAmount,
  }
};

export default useBorrowAndBoost; 
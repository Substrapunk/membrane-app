import contracts from '@/config/contracts.json'
import { StakingMsgComposer } from '@/contracts/codegen/staking/Staking.message-composer'
import { shiftDigits } from '@/helpers/math'
import { useAssetBySymbol } from '@/hooks/useAssets'
import useSimulate from '@/hooks/useSimulate'
import useSimulateAndBroadcast from '@/hooks/useSimulateAndBroadcast'
import useTransaction from '@/hooks/useTransaction'
import useWallet from '@/hooks/useWallet'
import { coin } from '@cosmjs/amino'
import { MsgExecuteContractEncodeObject } from '@cosmjs/cosmwasm-stargate'
import { useQuery } from '@tanstack/react-query'
import useStakeState from './useStakeState'
import { queryClient } from '@/pages/_app'

type UseStake = {
  amount: string
}

const useStakeing = ({}: UseStake) => {
  const { address } = useWallet()
  const mbrnAsset = useAssetBySymbol('MBRN')
  const { stakeState } = useStakeState()
  const { amount, txType } = stakeState

  const { data: stakeMsgs = [] } = useQuery<MsgExecuteContractEncodeObject[]>({
    queryKey: ['msg', address, mbrnAsset?.base, contracts.staking, amount, txType],
    queryFn: async () => {
      if (!address || !mbrnAsset) return [] as MsgExecuteContractEncodeObject[]

      const messageComposer = new StakingMsgComposer(address, contracts.staking)
      const macroAmount = shiftDigits(amount, mbrnAsset?.decimal).toString()
      const funds = [coin(macroAmount, mbrnAsset?.base)]
      let msg

      if (txType === 'Stake') msg = messageComposer.stake({ user: address }, funds)
      else if (txType === 'Unstake') msg = messageComposer.unstake({ mbrnAmount: macroAmount })
      else msg = null

      if (!msg) return [] as MsgExecuteContractEncodeObject[]

      return [msg]
    },
    enabled: !!address && !!mbrnAsset && !!contracts.staking && Number(amount) > 0,
  })

  return useSimulateAndBroadcast({
    msgs: stakeMsgs,
    amount: amount,
    queryKey: [mbrnAsset?.base!],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staked'] })
    },
  })
}

export default useStakeing
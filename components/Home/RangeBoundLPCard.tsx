import { Card, Text, Stack, HStack, Input, Button, Slider, SliderTrack, SliderFilledTrack, List, ListItem, useBreakpointValue } from "@chakra-ui/react"
import { TxButton } from "../TxButton"
import useSPCompound from "./hooks/useSPCompound"
import { useCallback, useEffect, useMemo, useState } from "react"
import { isGreaterThanZero, num } from "@/helpers/num"
import { useBoundedCDTVaultTokenUnderlying, useBoundedCDTRealizedAPR, getBoundedCDTBalance, useBoundedCDTBalance, useEstimatedAnnualInterest, useBoundedTVL, useRBLPCDTBalance } from "../../hooks/useEarnQueries"
import useBidState from "../Bid/hooks/useBidState"
import useQuickActionState from "./hooks/useQuickActionState"
import { useAssetBySymbol } from "@/hooks/useAssets"
import { useBalanceByAsset } from "@/hooks/useBalance"
import ActModal from "../Earn/ActModal"
import { SliderWithState } from "../Mint/SliderWithState"
import { shiftDigits } from "@/helpers/math"
import useAutoSP from "./hooks/useAutoSP"
import { useBasket } from "@/hooks/useCDP"
import Divider from "../Divider"
import React from "react"
import ConfirmModal from "../ConfirmModal"
import { QASummary } from "./QASummary"
import { GrPowerReset } from "react-icons/gr"
import useBoundedManage from "../Dashboard/hooks/useRangeBoundLPManage"
import useRangeBoundLP from "./hooks/useRangeBoundLP"
import { getBestCLRange } from "@/services/osmosis"
import { colors, LPJoinDate } from "@/config/defaults"
import YieldCounter from "./YieldCounter"

const ActSlider = React.memo(() => {
  const { quickActionState, setQuickActionState } = useQuickActionState()
  const boundCDTAsset = useAssetBySymbol('range-bound-CDT')
  const boundCDTBalance = useBalanceByAsset(boundCDTAsset) ?? "1"
  const cdtAsset = useAssetBySymbol('CDT')
  const cdtBalance = useBalanceByAsset(cdtAsset)
  const { data: underlyingData } = useBoundedCDTVaultTokenUnderlying(
    num(shiftDigits(boundCDTBalance, 6)).toFixed(0)
  )

  const underlyingCDT = useMemo(() =>
    shiftDigits(underlyingData, -6).toString() ?? "0"
    , [underlyingData])

  const { action: rbLP } = useRangeBoundLP({})
  const logo = useMemo(() => cdtAsset?.logo, [cdtAsset])

  const totalBalance = useMemo(() =>
    num(underlyingCDT).plus(cdtBalance).toString()
    , [cdtBalance, underlyingCDT])

  const pendingBalance = useMemo(() =>
    num(underlyingCDT)
      .plus(quickActionState.rangeBoundLPdeposit)
      .minus(quickActionState.rangeBoundLPwithdrawal)
      .toNumber()
    , [underlyingCDT, quickActionState.rangeBoundLPdeposit, quickActionState.rangeBoundLPwithdrawal])

  const actingAmount = useMemo(() => (
    quickActionState.rangeBoundLPdeposit > 0
      ? quickActionState.rangeBoundLPdeposit
      : quickActionState.rangeBoundLPwithdrawal
  ).toFixed(0), [quickActionState.rangeBoundLPdeposit, quickActionState.rangeBoundLPwithdrawal])

  const onSliderChange = useCallback((value: number) => {
    if (value > parseFloat(underlyingCDT)) {
      const diff = num(value).minus(underlyingCDT).toNumber()
      setQuickActionState({
        rangeBoundLPdeposit: diff,
        rangeBoundLPwithdrawal: 0,
        autoSPdeposit: 0,
        autoSPwithdrawal: 0
      })
    } else if (value < parseFloat(underlyingCDT)) {
      const diff = num(underlyingCDT).minus(value).toNumber()
      setQuickActionState({
        rangeBoundLPdeposit: 0,
        rangeBoundLPwithdrawal: diff,
        autoSPdeposit: 0,
        autoSPwithdrawal: 0
      })
    }
  }, [underlyingCDT, setQuickActionState])

  const onReset = useCallback(() => {
    setQuickActionState({
      rangeBoundLPdeposit: 0,
      rangeBoundLPwithdrawal: 0,
      autoSPdeposit: 0,
      autoSPwithdrawal: 0
    })
  }, [setQuickActionState])

  return (
    <Stack gap="0" borderWidth={3} borderRadius="2rem">
      <HStack justifyContent="space-between" padding="4%">
        <Text fontSize="lg" fontFamily="Inter" variant="lable" textTransform="unset">
          CDT in Vault
        </Text>
        <HStack>
          <Text fontFamily="Inter" variant="value">{pendingBalance.toFixed(2)}</Text>
        </HStack>
      </HStack>

      <SliderWithState
        color={colors.slider}
        width="92%"
        padding="4%"
        value={num(underlyingCDT)
          .minus(quickActionState.rangeBoundLPwithdrawal)
          .plus(quickActionState.rangeBoundLPdeposit)
          .toNumber()}
        onChange={onSliderChange}
        max={Number(totalBalance)}
      />

      <HStack gap={0} padding="4%">
        <Button
          variant="ghost"
          width="10"
          padding={0}
          leftIcon={<GrPowerReset />}
          onClick={onReset}
        />
        <ConfirmModal
          label={quickActionState.rangeBoundLPdeposit > 0
            ? `Deposit ${actingAmount} CDT`
            : quickActionState.rangeBoundLPwithdrawal > 0
              ? `Withdraw ${actingAmount} CDT`
              : "Act"
          }
          action={rbLP}
          isDisabled={Number(totalBalance) < 1 || pendingBalance === num(underlyingCDT).toNumber()}
        >
          <QASummary logo={logo} />
        </ConfirmModal>
      </HStack>
    </Stack>
  )
})



const RangeBoundLPCard = () => {
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false
  const { action: manage } = useBoundedManage()
  useEstimatedAnnualInterest(false)
  //Get total deposit tokens
  const { data: TVL } = useBoundedTVL()
  const { data: amountToManage } = useRBLPCDTBalance()

  const { data: basket } = useBasket()
  const { data: realizedAPR } = useBoundedCDTRealizedAPR()

  const revenueDistributionThreshold = 50000000
  const percentToDistribution = useMemo(() => {
    if (!basket) return 0
    return num(basket?.pending_revenue).dividedBy(revenueDistributionThreshold).toNumber()

  }, [basket])

  const { data: clRewardList } = getBestCLRange()
  const daysSinceDeposit = num(Date.now() - LPJoinDate.getTime()).dividedBy(1000).dividedBy(86400).toNumber()
  const rangeBoundAPR = useMemo(() => {
    //upperXlower & middle are just for logs rn
    if (!clRewardList) return 0

    const totalrewards = (clRewardList[2].reward + clRewardList[3].reward + clRewardList[4].reward + clRewardList[10].reward + clRewardList[11].reward + clRewardList[12].reward) / 6
    const middleAPR = ((clRewardList[5].reward + clRewardList[6].reward + clRewardList[7].reward + clRewardList[8].reward + clRewardList[9].reward) / 5) / 1000000 / daysSinceDeposit * 365
    console.log("middleAPR", middleAPR)
    return totalrewards / 1000000 / daysSinceDeposit * 365
  }, [clRewardList])
  console.log("rangeBoundAPR", rangeBoundAPR)



  const { bidState } = useBidState()
  const isDisabled = useMemo(() => { return manage?.simulate.isError || !manage?.simulate.data || num(amountToManage).isZero() }, [manage?.simulate.isError, manage?.simulate.data])

  return (
    <Card width={isMobile ? "100%" : "50%"} borderWidth={3} padding={4}>
      <Stack>
        <Text variant="title" fontFamily="Inter" fontSize={"md"} letterSpacing={"1px"} justifyContent={"center"} display="flex" color={colors.earnText}>Earn CDT</Text>
        <Stack>
          <Text variant="title" fontFamily="Inter" fontSize={"lg"} letterSpacing={"1px"} display="flex"><a style={{ fontWeight: "bold", color: colors.earnText }}>{realizedAPR ? `${realizedAPR?.runningDuration.toString()}D` : "Real"} APY: &nbsp;</a> <a className="textShadow">{realizedAPR?.negative ? "-" : ""}{(realizedAPR && realizedAPR.apr) ? num(realizedAPR?.apr).times(100).toFixed(1) + "%" : "loading..."}</a></Text>
          <Text variant="title" fontFamily="Inter" fontSize={"lg"} letterSpacing={"1px"} display="flex"><a style={{ fontWeight: "bold", color: colors.earnText }}>Estimated APR: &nbsp;</a>{bidState.cdpExpectedAnnualRevenue ? num(bidState.cdpExpectedAnnualRevenue).times(0.80).dividedBy(TVL || 1).plus(rangeBoundAPR).multipliedBy(100).toFixed(1) + "%" : "loading..."}</Text>
        </Stack>
        <Divider marginBottom={"3vh"} />
        <List spacing={3} styleType="disc" padding="6" paddingTop="0">
          <ListItem fontFamily="Inter" fontSize="md"><a style={{ fontWeight: "bold", color: colors.earnText }}>Yield:</a> Revenue & Swap Fees</ListItem>
          <ListItem fontFamily="Inter" fontSize="md">
            <YieldCounter incrementPerSecond={bidState.cdpExpectedAnnualRevenue ? shiftDigits(bidState.cdpExpectedAnnualRevenue, -6).times(0.80).dividedBy(86400 * 365).toNumber() : 0} precision={8} />
          </ListItem>
        </List>
        <ActSlider />
        <Divider marginTop={"3"} marginBottom={"3"} />
        <Slider
          defaultValue={percentToDistribution}
          isReadOnly
          cursor="default"
          min={0}
          max={1}
          value={percentToDistribution}
        >
          <SliderTrack h="1.5">
            <SliderFilledTrack bg={'#20d6ff'} />
          </SliderTrack>
        </Slider>
        <TxButton
          maxW="100%"
          isLoading={manage?.simulate.isLoading || manage?.tx.isPending}
          isDisabled={isDisabled}
          onClick={() => manage?.tx.mutate()}
          toggleConnectLabel={false}
          style={{ alignSelf: "center" }}
        >
          {isDisabled && percentToDistribution >= 1 ? "Next Repayment Pays to LPs" : "Manage Vault"}
        </TxButton>
      </Stack>
    </Card>
  )
}

export default RangeBoundLPCard
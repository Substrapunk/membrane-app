import { Card, Text, Stack, HStack, Input, Button, Slider, SliderTrack, SliderFilledTrack, List, ListItem } from "@chakra-ui/react"
import { TxButton } from "../TxButton"
import useSPCompound from "./hooks/useSPCompound"
import { useEffect, useMemo, useState } from "react"
import { isGreaterThanZero, num } from "@/helpers/num"
import { useUSDCVaultTokenUnderlying, useEstimatedAnnualInterest, useVaultInfo, useEarnUSDCEstimatedAPR, useEarnUSDCRealizedAPR } from "../../hooks/useEarnQueries"
import useBidState from "../Bid/hooks/useBidState"
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
import useEarnState from "../Earn/hooks/useEarnState"
import useEarn from "../Earn/hooks/useEarn"
import { colors } from "@/config/defaults"

const ActSlider = React.memo(({ isDisabled }: { isDisabled: boolean }) => {
  const { earnState, setEarnState } = useEarnState()
  const earnUSDCAsset = useAssetBySymbol('earnUSDC')
  const earnUSDCBalance = useBalanceByAsset(earnUSDCAsset) ?? "1"
  const USDCAsset = useAssetBySymbol('USDC')
  const USDCBalance = useBalanceByAsset(USDCAsset)

  //Set withdraw slider max to the total USDC deposit, not the looped VT deposit
  const { data } = useUSDCVaultTokenUnderlying(shiftDigits(earnUSDCBalance, 6).toFixed(0))
  const underlyingUSDC = shiftDigits(data, -6).toString() ?? "1"
  ////////////////////////////////////

  const { action: earn } = useEarn();

  const logo = useMemo(() => { return USDCAsset?.logo }, [USDCAsset])
  console.log("USDCAsset logo", logo)

  const totalBalance = useMemo(() => {
    return num(underlyingUSDC).plus(USDCBalance).toString()
  }, [USDCBalance, underlyingUSDC])
  console.log("USDCs", USDCBalance, underlyingUSDC, totalBalance)

  const pendingBalance = useMemo(() => {
    return num(underlyingUSDC).plus(earnState.deposit).minus(earnState.withdraw).toNumber()
  }, [underlyingUSDC, earnState.deposit, earnState.withdraw])
  //set amount label 
  const actingAmount = useMemo(() => {
    return (earnState.deposit > 0 ? earnState.deposit : earnState.withdraw).toFixed(0)
  }, [earnState.deposit, earnState.withdraw])


  const onSliderChange = (value: number) => {
    if (value > parseFloat(underlyingUSDC)) {
      let diff = num(value).minus(underlyingUSDC).toNumber()
      setEarnState({ deposit: diff, withdraw: 0 })
      console.log("deposit", diff)

    } else if (value < parseFloat(underlyingUSDC)) {
      let diff = num(underlyingUSDC).minus(value).toNumber()
      setEarnState({ deposit: 0, withdraw: diff })
      console.log("withdraw", diff)
    }

  }

  const onReset = () => {
    setEarnState({ deposit: 0, withdraw: 0 })
  }

  return (
    <Stack gap="0" borderWidth={"1px"} borderColor="rgb(226, 216, 218)" borderRadius={"2rem"}>
      <HStack justifyContent="space-between" padding={"4%"}>
        <Text fontSize="lg" fontFamily="Inter" variant="lable" textTransform="unset">
          USDC in Vault
        </Text>
        <HStack>
          <Text fontFamily="Inter" variant="value">${pendingBalance.toFixed(2)}</Text>
        </HStack>
      </HStack>
      <SliderWithState
        color={colors.slider}
        width="92%"
        padding="4%"
        value={num(underlyingUSDC).minus(earnState.withdraw).plus(earnState.deposit).toNumber()}
        onChange={onSliderChange}
        max={Number(totalBalance)}
      />


      <HStack gap={0} padding="4%">
        <Button variant="ghost" width={"10"} padding={0} leftIcon={<GrPowerReset />} onClick={onReset} />
        <ConfirmModal
          label={isDisabled && earnState.deposit > 0 ? "Deposits Disabled" : earnState.deposit > 0 ? `Deposit ${actingAmount.toString()} USDC` : earnState.withdraw > 0 ? `Withdraw ${actingAmount.toString()} USDC` : "Manage"}
          action={earn}
          isDisabled={Number(totalBalance) < 1 || pendingBalance === num(underlyingUSDC).toNumber() || (isDisabled && earnState.deposit > 0)}>
          <QASummary logo={logo} />
        </ConfirmModal>
      </HStack>
    </Stack>
  )
});

const EarnCard = () => {
  const { earnState, setEarnState } = useEarnState()
  const earnUSDCAsset = useAssetBySymbol('earnUSDC')
  const earnUSDCBalance = useBalanceByAsset(earnUSDCAsset) ?? "1"

  //Set withdraw slider max to the total USDC deposit, not the looped VT deposit
  const { data } = useUSDCVaultTokenUnderlying(shiftDigits(earnUSDCBalance, 6).toFixed(0))
  const underlyingUSDC = shiftDigits(data, -6).toString() ?? "1"
  ////////////////////////////////////

  const pendingBalance = useMemo(() => {
    return num(underlyingUSDC).plus(earnState.deposit).minus(earnState.withdraw).toNumber()
  }, [underlyingUSDC, earnState.deposit, earnState.withdraw])


  const { data: realizedAPR } = useEarnUSDCRealizedAPR()
  const { data: vaultInfo } = useVaultInfo()
  const { data: APRs } = useEarnUSDCEstimatedAPR()
  const APRObject = useMemo(() => {
    if (!APRs) return {
      weekly: "loading...",
      monthly: "loading...",
      three_month: "loading...",
      yearly: "loading...",
    }
    return {
      weekly: APRs.week_apr ? num(APRs?.week_apr).minus(num(vaultInfo?.cost)).times(vaultInfo?.leverage ?? 1).multipliedBy(100).toFixed(1) + "%" : "loading...",
      monthly: APRs.month_apr ? num(APRs?.month_apr).minus(num(vaultInfo?.cost)).times(vaultInfo?.leverage ?? 1).multipliedBy(100).toFixed(1) + "%" : "loading...",
      three_month: APRs.three_month_apr ? num(APRs?.three_month_apr).minus(num(vaultInfo?.cost)).times(vaultInfo?.leverage ?? 1).multipliedBy(100).toFixed(1) + "%" : "loading...",
      yearly: APRs.year_apr ? num(APRs?.year_apr).minus(num(vaultInfo?.cost)).times(vaultInfo?.leverage ?? 1).multipliedBy(100).toFixed(1) + "%" : "loading...",
    }
  }, [APRs, vaultInfo])
  const { longestAPR } = useMemo(() => {
    if (!APRObject) return { longestAPR: "0" }
    if (APRObject.yearly && APRObject.yearly != "loading...") return { longestAPR: APRObject.yearly }
    if (APRObject.three_month && APRObject.three_month != "loading...") return { longestAPR: APRObject.three_month }
    if (APRObject.monthly && APRObject.monthly != "loading...") return { longestAPR: APRObject.monthly }
    return { longestAPR: APRObject.weekly }
  }, [APRObject])

  const isDisabled = useMemo(() => { return (vaultInfo?.debtAmount ?? 0) >= 200 }, [vaultInfo])

  return (
    <Card width={"33%"} borderColor={""} borderWidth={3} padding={4}>
      <Stack>
        <Text fontFamily="Inter" variant="title" fontSize={"md"} letterSpacing={"1px"} justifyContent={"center"} display="flex" color={colors.earnText}>Earn USDC</Text>
        <Stack>
          <Text fontFamily="Inter" variant="title" fontSize={"lg"} letterSpacing={"1px"} display="flex"><a style={{ fontWeight: "bold", color: colors.slider }}>{realizedAPR ? `${realizedAPR?.runningDuration.toString()}D` : "Real"} APY: &nbsp;</a> <a className="textShadow">{realizedAPR?.negative ? "-" : ""}{(realizedAPR && realizedAPR.apr) ? num(realizedAPR?.apr).times(100).toFixed(1) + "%" : "loading..."}</a></Text>
          <Text fontFamily="Inter" variant="title" fontSize={"lg"} letterSpacing={"1px"} display="flex"><a style={{ fontWeight: "bold", color: colors.earnText }}>Estimated APR: &nbsp;</a> {longestAPR}</Text>
        </Stack>
        <Divider marginBottom={"3vh"} />
        <List spacing={3} styleType="disc" padding="6" paddingTop="0">
          <ListItem fontFamily="Inter" fontSize="md"><a style={{ fontWeight: "bold", color: colors.slider }}>Yield:</a> Looped Mars USDC yield, CDT Redemptions & 0.5% entry fee</ListItem>
          <ListItem fontFamily="Inter" fontSize="md">You <a style={{ fontWeight: "bold", color: colors.alert }}>pay</a> unloop costs to exit</ListItem>
          <ListItem fontFamily="Inter" fontSize="md">Deposits <a style={isDisabled ? { fontWeight: "bold", color: colors.alert } : {}}>disabled</a> above 200 Debt</ListItem>
        </List>
        <ActSlider isDisabled={isDisabled} />
        <Divider marginTop={"3vh"} />
        {/* <Slider
              defaultValue={percentToDistribution}
              isReadOnly
              cursor="default"
              min={0}
              max={1}
              value={percentToDistribution}
            >
              <SliderTrack h="1.5">
                <SliderFilledTrack bg={'blue.400'} />
              </SliderTrack>
            </Slider>
            <TxButton
              maxW="100%"
              isLoading={compound?.simulate.isLoading || compound?.tx.isPending}
              isDisabled={isDisabled}
              onClick={() => compound?.tx.mutate()}
              toggleConnectLabel={false}
              style={{ alignSelf: "center" }}
            >
              {isDisabled && percentToDistribution >= 1 ? "Next Repayment Pays to Omni-Pool" : "Compound"}
            </TxButton> */}
      </Stack>
    </Card>
  )
}

export default EarnCard
import { num } from '@/helpers/num'
import { useAssetBySymbol } from '@/hooks/useAssets'
import { Badge, HStack, Image, Stack, Text } from '@chakra-ui/react'
import useQuickActionState from './hooks/useQuickActionState'
import { AssetWithBalance } from '../Mint/hooks/useCombinBalance'
import { useMemo } from 'react'
import { loopMax } from '@/config/defaults'

type SummaryItemProps = Partial<AssetWithBalance> & {
  label: string
  amount?: string | number
  showBadge?: boolean
  badge?: string
  logo?: string
  logos?: string[]
  isLP?: boolean
  newValue?: string
  newLTV?: string
}

const SummaryItem = ({
  label,
  amount = 0,
  badge,
  showBadge = true,
  logo,
  logos,
  isLP,
  newValue,
  newLTV,
}: SummaryItemProps) => (
  <HStack
    key={label}
    justifyContent="space-between"
    pb="1"
    my="1"
    borderBottom="1px solid"
    borderColor="whiteAlpha.200"
  >
    <HStack>
      <HStack>
        {isLP ? (
          <HStack>
            <Image src={logos?.[0]} w="24px" h="24px" />
            <Image src={logos?.[1]} w="24px" h="24px" ml="-16px" />
          </HStack>
        ) : (
          <Image src={logo} w="24px" h="24px" />
        )}
        <Text variant="value" textTransform="unset">
          {label}
        </Text>
      </HStack>

      {showBadge && (
        <Badge fontSize="10px" colorScheme="green">
          {badge}
        </Badge>
      )}
      {badge === "SWAP" ? label !== "CDT" ? <Text variant="value" textTransform="unset">
      to CDT
      </Text> : <Text variant="value" textTransform="unset">
      to USDC
      </Text> : badge === "BID" ? <Text variant="value" textTransform="unset">
       on all assets at a 10% premium
      </Text> : badge === "LOOP" ? <Text variant="value" textTransform="unset">
       to a {newLTV}% LTV & ${newValue} position value
      </Text>
      : null}
    </HStack>
    <HStack>
      {badge !== "LOOP" ? <Text>{num(amount).abs().toString()}</Text> : null}
    </HStack>
  </HStack>
)

export const QASummary = ({ newPositionValue, newLTV } : {newPositionValue: number, newLTV: number}) => {
  const { quickActionState } = useQuickActionState()
  const summary = useMemo(() => {
    if (quickActionState?.selectedAsset && num(quickActionState?.selectedAsset?.amount).isGreaterThan(0)) return [quickActionState?.selectedAsset]
    else return []
  }, [quickActionState?.selectedAsset?.amount])
  const cdt = useAssetBySymbol('CDT')
  const usdc = useAssetBySymbol('USDC')

  return (
    <Stack h="max-content" overflow="auto" w="full">
      {!quickActionState.swapInsteadofMint ? summary?.map((asset) => {
        const badge = 'Deposit'
        return (
          <SummaryItem
            key={asset?.label + asset?.amount}
            label={asset?.label}
            amount={asset?.amount}
            logo={asset?.logo}
            logos={asset?.logos}
            isLP={asset?.isLP}
            badge={badge}
          />
        )
      }) : null}

        {num(quickActionState.mint).isGreaterThan(0) ? <>
        
        {!quickActionState.swapInsteadofMint ? <SummaryItem
          label="CDT"
          badge="Mint"
          amount={quickActionState.mint?.toFixed(2)}
          logo={cdt?.logo}
        /> : <SummaryItem
          label={quickActionState.selectedAsset?.label}
          badge="SWAP"
          amount={num(quickActionState.selectedAsset?.amount??0).toFixed(2)}
          logo={quickActionState.selectedAsset?.logo}
        />}

        {quickActionState.action.value === "LP" ? <>
          {(quickActionState?.selectedAsset?.symbol === "USDC" && quickActionState?.action.value === "LP" && quickActionState.swapInsteadofMint) ? null : <SummaryItem
            label="CDT"
            badge="SWAP"
            amount={num(quickActionState.mint).div(2).toNumber().toFixed(2)}
            logo={cdt?.logo}
          />}
          
          <SummaryItem
            label="CDT/USDC"
            badge="LP"
            amount={num(quickActionState.mint).toFixed(2)}
            isLP={true}
            logos={[cdt!.logo, usdc!.logo]}
          />
        </> : quickActionState.action.value === "Bid" ? <>
          <SummaryItem
            label="CDT"
            badge="BID"
            amount={num(quickActionState.mint).toFixed(2)}
            logo={cdt?.logo}
          />
        </>        
        : quickActionState.action.value === "Loop" ? <>
        <SummaryItem
          label="CDT"
          badge="LOOP"
          newValue={newPositionValue.toFixed(0)}
          newLTV={(newLTV * 100).toFixed(0)}
          logo={cdt?.logo}
        />
      </> 
        : null}
        
        </> : null}
    </Stack>
  )
}
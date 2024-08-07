import { getAssetLogo } from '@/helpers/chain'
import { num } from '@/helpers/num'
import { Asset } from '@chain-registry/types'
import { Badge, HStack, Image, Stack, Text } from '@chakra-ui/react'
import useStakeState from './hooks/useStakeState'

type SummaryItemProps = Partial<Asset> & {
  label: string
  amount?: string | number
  showBadge?: boolean
  badge?: string
  logo?: string
}

const SummaryItem = ({ label, amount = 0, badge, showBadge = true, logo }: SummaryItemProps) => (
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
        <Image src={logo} w="20px" h="20px" />
        <Text variant="value" textTransform="unset">
          {label}
        </Text>
      </HStack>

      {showBadge && (
        <Badge fontSize="10px" colorScheme="green">
          {badge}
        </Badge>
      )}
    </HStack>
    <HStack>
      <Text>{num(amount).abs().toString()}</Text>
    </HStack>
  </HStack>
)

export const Summary = () => {
  const { stakeState } = useStakeState()
  const { asset } = stakeState
  const logo = getAssetLogo(asset!)

  return (
    <Stack h="max-content" overflow="auto" w="full">
      <SummaryItem
        label={asset?.symbol!}
        badge={stakeState?.txType}
        amount={stakeState.amount}
        logo={logo}
      />
    </Stack>
  )
}

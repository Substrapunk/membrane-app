import { HStack, Stack, Text } from '@chakra-ui/react'
import LiveAuction from './LiveAuction'
import NFTBid from './NFTBid'
import AssetAuction from './AssetAuction'
import BridgeToStargaze from './BridgeToStargaze'

const NFT = () => {
    return (
        <HStack gap="5" w="full" alignItems="flex-start">
            <Stack w="full" gap="5">
                <Text variant="title">NFT AUCTION</Text>
                <LiveAuction/>
                <NFTBid />
            </Stack>
            <Stack w="full" gap="5">
                <BridgeToStargaze />
                <AssetAuction />
            </Stack>
            {/* Claim button for either the NFT or the Asset */}
        </HStack>
    )
}

export default NFT
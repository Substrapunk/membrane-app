import { Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import ConfirmModal from '../ConfirmModal'
import { ClaimSummary } from '../Bid/ClaimSummary'
import useProtocolClaims from './hooks/useClaims'
import useProtocolLiquidations from './hooks/useLiquidations'
import { LiqSummary } from './LiqSummary'

function UniversalButtons({ enabled }: { enabled: boolean }) {
    const { action: claim, claims_summary } = useProtocolClaims({ run: enabled })
    const { action: liquidate, liquidating_positions: liq_summ } = useProtocolLiquidations({ run: enabled })

    return (
        <Stack as="uniButtons" gap="1">
            {/* Claim Button */}
            <ConfirmModal
                label={'Claim'}
                action={claim}
                isDisabled={claims_summary.length === 0}
            // isLoading={false}
            >
                <ClaimSummary claims={claims_summary} />
            </ConfirmModal>
            {/* Liquidate Button */}
            <ConfirmModal
                label={'Liquidate'}
                action={liquidate}
                isDisabled={liq_summ.length === 0}
            >
                <LiqSummary liquidations={liq_summ} />
            </ConfirmModal>
        </Stack>
    )
}

export default UniversalButtons
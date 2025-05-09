
import contracts from '@/config/contracts.json'
import { getCosmWasmClient, useCosmWasmClient } from '@/helpers/cosmwasmClient'
import { EarnQueryClient } from '@/contracts/codegen/earn/Earn.client'
import { APRResponse, ClaimTracker } from '@/contracts/codegen/earn/Earn.types'
import { BasketPositionsResponse, Uint128 } from '@/contracts/codegen/positions/Positions.types'
import { BasketAsset, getAssetRatio, getDebt, getPositions, getRateCost, getTVL } from './cdp'
import { shiftDigits } from '@/helpers/math'
import { Price } from './oracle'
import { useQuery } from '@tanstack/react-query'
import { ManagedConfig, MarketConfig, MarketData, MarketParams } from '@/components/ManagedMarkets/hooks/useManagerState'
import { IntentResponse } from './earn'
import { start } from 'repl'

export const getManagers = async (cosmWasmClient: any) => {
    return cosmWasmClient.queryContractSmart(contracts.marketManager, {
        managers: {
            start_after: undefined,
            limit: undefined,
        }
    }) as Promise<string[]>
    //returns addresses of 32 managers
}

export const getManagedMarketContracts = async (cosmWasmClient: any, manager: string) => {
    return cosmWasmClient.queryContractSmart(contracts.marketManager, {
        markets_managed: {
            manager
        }
    }) as Promise<string[]>
    //returns addresses of all managed markets
}

export const getManagedConfig = async (cosmWasmClient: any, marketContract: string) => {
    return cosmWasmClient.queryContractSmart(marketContract, {
        config: {}
    }) as Promise<ManagedConfig>
}

export const getManagedMarket = async (cosmWasmClient: any, marketContract: string, collateral_denom: string) => {
    return cosmWasmClient.queryContractSmart(marketContract, {
        market_params: { collateral_denom }
    }) as Promise<MarketParams>
}

export const getManagedMarkets = async (cosmWasmClient: any, manager: string) => {
    return cosmWasmClient.queryContractSmart(contracts.marketManager, {
        market_params: {
            manager,
            start_after: undefined,
            limit: undefined
        }
    }) as Promise<MarketData[]>
}

//////////


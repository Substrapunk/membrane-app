import contracts from '@/config/contracts.json'
import { LaunchClient, LaunchQueryClient } from '@/contracts/codegen/launch/Launch.client'
import { AssetInfo, UserRatio } from '@/contracts/codegen/launch/Launch.types'
import {
  LiquidationQueueQueryClient,
  LiquidationQueueClient,
} from '@/contracts/codegen/liquidation_queue/LiquidationQueue.client'
import { LiquidationQueueMsgComposer } from '@/contracts/codegen/liquidation_queue/LiquidationQueue.message-composer'
import { Addr } from '@/contracts/generated/positions/Positions.types'
import { Asset, getAssetBySymbol } from '@/helpers/chain'
import getCosmWasmClient from '@/helpers/comswasmClient'
import { shiftDigits } from '@/helpers/math'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { Coin, coin } from '@cosmjs/stargate'

export const liquidationClient = async () => {
  const cosmWasmClient = await getCosmWasmClient()
  return new LiquidationQueueQueryClient(cosmWasmClient, contracts.liquidation)
}

export const getSigningLiquidationClient = (
  signingClient: SigningCosmWasmClient,
  address: Addr,
) => {
  return new LiquidationQueueClient(signingClient, address, contracts.liquidation)
}

export const getLiquidationQueue = async (asset: Asset) => {
  const client = await liquidationClient()
  return client.premiumSlots({
    bidFor: {
      native_token: {
        denom: asset.base,
      },
    },
  })
}
export const getQueue = async (asset: Asset) => {
  const client = await liquidationClient()
  return client.queue({
    bidFor: {
      native_token: {
        denom: asset.base,
      },
    },
  })
}

type BidMsg = {
  address: Addr
  asset: Asset
  liqPremium: number
  funds?: Coin[]
}

const getBidInput = (denom: string, liq_premium: number) => {
  return {
    bid_for: {
      native_token: {
        denom,
      },
    },
    liq_premium,
  }
}

export const buildBidMsg = ({ address, asset, liqPremium, funds = [] }: BidMsg) => {
  const messageComposer = new LiquidationQueueMsgComposer(address, contracts.liquidation)
  const bidInput = getBidInput(asset.base, liqPremium)
  return messageComposer.submitBid({ bidInput }, funds)
}

type UpdateBidMsg = {
  address: Addr
  denom: string
  funds?: Coin[]
}
export const buildUpdateBidMsg = ({ address, denom, funds = [] }: UpdateBidMsg) => {
  const messageComposer = new LiquidationQueueMsgComposer(address, contracts.liquidation)
  return messageComposer.updateQueue(
    {
      bidFor: {
        native_token: {
          denom,
        },
      },
    },
    funds,
  )
}

type RetractBidMsg = {
  address: Addr
  bidId: string
  denom: string
  amount?: string
}
export const buildRetractBidMsg = ({ address, denom, bidId, amount }: RetractBidMsg) => {
  const messageComposer = new LiquidationQueueMsgComposer(address, contracts.liquidation)
  return messageComposer.retractBid({
    bidFor: {
      native_token: {
        denom,
      },
    },
    bidId,
    amount,
  })
}

export const getUserBids = async (address: Addr, denom?: string) => {
  const client = await liquidationClient()

  if (!denom) return

  const bidFor = {
    native_token: {
      denom,
    },
  }
  return client.bidsByUser({
    bidFor,
    user: address,
  })
}

export const getUserClaims = async (address: Addr) => {
  const client = await liquidationClient()

  return client.userClaims({
    user: address,
  })
}
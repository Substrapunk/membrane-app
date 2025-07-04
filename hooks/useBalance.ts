import { shiftDigits } from '@/helpers/math'
import { useQuery } from '@tanstack/react-query'
import { QueryAllBalancesResponse } from 'osmojs/dist/codegen/cosmos/bank/v1beta1/query'
import { useMemo } from 'react'
import { useRpcClient } from './useRpcClient'
import useWallet from './useWallet'
import { Asset } from '@/helpers/chain'
import { DEFAULT_CHAIN } from '@/config/chains'
import { useChainRoute } from './useChainRoute'

export const useBalance = (chainID: string = DEFAULT_CHAIN, inputedAddress?: string) => {

  const { chainName } = useChainRoute()
  const { address, chain } = useWallet(chainName)
  const addressToUse = inputedAddress || address
  const { getRpcClient } = useRpcClient(chain.chain_name)

  return useQuery<QueryAllBalancesResponse['balances'] | null>({
    queryKey: [chainID + ' balances', addressToUse, chain.chain_id],
    queryFn: async () => {
      const client = await getRpcClient()
      if (!addressToUse) return null

      return client.cosmos.bank.v1beta1
        .allBalances({
          address: addressToUse,
          pagination: {
            key: new Uint8Array(),
            offset: BigInt(0),
            limit: BigInt(1000),
            countTotal: false,
            reverse: false,
          },
        })
        .then((res) => {
          return res.balances
        })
    },
    enabled: !!getRpcClient && !!address,
    staleTime: 1000 * 10,
    refetchOnWindowFocus: true,
  })
}

export const useBalanceByAsset = (asset: Asset | null, chainID: string = DEFAULT_CHAIN, inputedAddress?: string) => {
  // console.log("useBalanceByAsset1", asset, chainID, inputedAddress)
  const { data: balances } = useBalance(chainID, inputedAddress)
  // console.log("useBalanceByAsset3", asset, chainID, inputedAddress, balances)

  let addressToUse = inputedAddress
  if (!inputedAddress) {
    const { address } = useWallet(chainID)
    // console.log("useBalanceByAsset4", address)
    addressToUse = address
  }

  return useMemo(() => {

    // console.log(" useBalanceByAsset", balances, asset, addressToUse)
    if (!balances || !asset || !addressToUse) return '0'

    const balance = balances.find((b: any) => b.denom === asset.base)?.amount
    const denom = asset.base
    const decimals = asset.decimal || 6

    if (!balance || !decimals || !denom) return '0'
    return shiftDigits(balance, -decimals).toString()
  }, [balances, asset, addressToUse])
}

export default useBalance

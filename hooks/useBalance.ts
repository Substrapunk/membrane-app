import { shiftDigits } from '@/helpers/math'
import { useQuery } from '@tanstack/react-query'
import { QueryAllBalancesResponse } from 'osmojs/dist/codegen/cosmos/bank/v1beta1/query'
import { useMemo } from 'react'
import { useRpcClient } from './useRpcClient'
import useWallet from './useWallet'
import { Asset } from '@/helpers/chain'

export const useBalance = () => {
  const { address, chain } = useWallet()
  const { getRpcClient } = useRpcClient(chain.chain_name)

  return useQuery<QueryAllBalancesResponse | null>({
    queryKey: ['balances', address, chain.chain_id],
    queryFn: async () => {
      const client = await getRpcClient()
      if (!address) return null

      return client.cosmos.bank.v1beta1.allBalances({
        address,
        pagination: {
          key: new Uint8Array(),
          offset: BigInt(0),
          limit: BigInt(1000),
          countTotal: false,
          reverse: false,
        },
      })
    },
    enabled: !!getRpcClient && !!address,
  })
}

export const useBalanceByAsset = (asset: Asset | null) => {
  const { data } = useBalance()
  const { address } = useWallet()

  return useMemo(() => {
    if (!data || !asset || !address) return '0'

    const balance = data?.balances.find((b: any) => b.denom === asset.base)?.amount
    const denom = asset.base
    const decimals = asset.decimal || 6

    if (!balance || !decimals || !denom) return '0'

    return shiftDigits(balance, -decimals).toString()
  }, [data, asset, address])
}

export default useBalance

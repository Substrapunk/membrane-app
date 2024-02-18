import { useQuery } from '@tanstack/react-query'
import { getBasket, getBasketPositions, getCollateralInterest, getCreditRate } from '@/services/cdp'
import useWallet from './useWallet'

export const useBasket = () => {
  return useQuery({
    queryKey: ['basket'],
    queryFn: async () => {
      return getBasket()
    },
  })
}

export const useCollateralInterest = () => {
  return useQuery({
    queryKey: ['collateral interest'],
    queryFn: async () => {
      return getCollateralInterest()
    },
  })
}

export const useCreditRate = () => {
  return useQuery({
    queryKey: ['credit rate'],
    queryFn: async () => {
      return getCreditRate()
    },
  })
}

export const useBasketPositions = () => {
  // const { address } = useWallet()
  // mock address
  const address = 'osmo1988s5h45qwkaqch8km4ceagw2e08vdw28mwk4n'
  return useQuery({
    queryKey: ['baseket positions', address],
    queryFn: async () => {
      if (!address) return
      return getBasketPositions(address)
    },
    enabled: !!address,
  })
}

import contracts from '@/config/contracts.json'
import { LaunchClient, LaunchQueryClient } from '@/contracts/codegen/launch/Launch.client'
import { UserRatio } from '@/contracts/codegen/launch/Launch.types'
import { Addr } from '@/contracts/generated/positions/Positions.types'
import { getAssetBySymbol } from '@/helpers/chain'
import { getCosmWasmClient } from '@/helpers/cosmwasmClient'
import { shiftDigits } from '@/helpers/math'
import { useChainRoute } from '@/hooks/useChainRoute'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

export const lockdropClient = async (rpcUrl: string) => {
  console.log("lockdrop CW client")
  const cosmWasmClient = await getCosmWasmClient(rpcUrl)
  return new LaunchQueryClient(cosmWasmClient, contracts.lockdrop)
}

export const getSigningLockdropClient = (signingClient: SigningCosmWasmClient, address: Addr) => {
  return new LaunchClient(signingClient, address, contracts.lockdrop)
}

const checkIfUserParticipated = (message: string) => {
  return message.includes("User didn't participate in the lockdrop")
}

const incentivesResponse = (amount: string, hasParticipated: boolean) => {
  return {
    amount,
    hasParticipated,
    message: hasParticipated ? null : "You didn't participate in the lockdrop",
  }
}

export const getLockdrop = async (rpcUrl: string) => {
  const client = await lockdropClient(rpcUrl)
  return client.lockdrop()
}

export const getIncentiveDistribution = async (rpcUrl: string) => {
  const client = await lockdropClient(rpcUrl)
  return client.incentiveDistribution()
}

export const getRanking = async (distribution: UserRatio[], address?: Addr) => {
  distribution.sort((a, b) => Number(b.ratio) - Number(a.ratio))
  const totalRanking = distribution.length
  const userRanking = distribution.findIndex((i) => i.user === address)
  return {
    totalRanking,
    userRanking: userRanking === -1 ? '0' : userRanking + 1,
  }
}

export const getIncentives = async (user: Addr, rpcUrl: string) => {
  const client = await lockdropClient(rpcUrl)

  return client
    .userIncentives({ user })
    .then((amount) => incentivesResponse(amount, true))
    .catch((e) => {
      const message = e.message
      if (checkIfUserParticipated(message)) {
        return incentivesResponse('0', false)
      }
      throw e
    })
}

export const getUserInfo = async (address: Addr, rpcUrl: string) => {
  const { chainName } = useChainRoute()
  const osmos = getAssetBySymbol('OSMO', chainName)
  const client = await lockdropClient(rpcUrl)
  const userInfo = await client.userInfo({
    user: address,
  })

  const updateData = userInfo?.deposits?.map((data) => {
    return {
      deposit: shiftDigits(data.deposit, -osmos?.decimal!).toNumber(),
      lockUpDuration: data.lock_up_duration,
      isNew: false,
    }
  })

  const totalLocked = updateData.reduce((acc, { deposit }) => acc + deposit, 0)

  //fill in empty data on updateData to match the length of 10 but keep the original data
  const emptyData = Array(10 - updateData.length).fill({
    deposit: '',
    lockUpDuration: '',
    isNew: true,
  })

  return {
    total_tickets: userInfo.total_tickets,
    totalLocked,
    lockups: [...updateData, ...emptyData],
  }
}

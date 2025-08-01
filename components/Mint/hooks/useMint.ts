import { getDepostAndWithdrawMsgs, getMintAndRepayMsgs } from '@/helpers/mint'
import { useBasket, useUserPositions } from '@/hooks/useCDP'
import useSimulateAndBroadcast from '@/hooks/useSimulateAndBroadcast'
import useWallet from '@/hooks/useWallet'
import { MsgExecuteContractEncodeObject } from '@cosmjs/cosmwasm-stargate'
import { useQuery } from '@tanstack/react-query'
import useMintState from './useMintState'
import { queryClient } from '@/pages/_app'
import { useMemo } from 'react'
import { MAX_CDP_POSITIONS } from '@/config/defaults'
import { useChainRoute } from '@/hooks/useChainRoute'

const useMint = () => {
  const { mintState, setMintState } = useMintState()
  const { summary = [] } = mintState
  const { address } = useWallet()
  const { data: basketPositions, ...basketErrors } = useUserPositions()
  const { data: basket } = useBasket()
  const { chainName } = useChainRoute()

  //Use the current position id or use the basket's next position ID (for new positions)
  const positionId = useMemo(() => {
    if (basketPositions !== undefined && basketPositions.length > 0 && (mintState.positionNumber < Math.min(basketPositions[0].positions.length + 1, MAX_CDP_POSITIONS) || (basketPositions[0].positions.length === MAX_CDP_POSITIONS))) {
      return basketPositions?.[0]?.positions?.[mintState.positionNumber - 1]?.position_id
    } else {
      //Use the next position ID
      return basket?.current_position_id ?? ""
    }
  }, [basketPositions, mintState.positionNumber, basket])

  const { data: msgs } = useQuery<MsgExecuteContractEncodeObject[] | undefined>({
    queryKey: [
      'mint',
      address,
      positionId,
      summary ? JSON.stringify(summary.map(s => String(s.amount))) : '0',
      mintState?.mint,
      mintState?.repay,
      chainName
    ],
    queryFn: () => {
      if (!address) return []
      // console.log("MINT LOGS", basketPositions !== undefined, mintState.positionNumber <= (basketPositions?.[0].positions.length ?? 0), mintState.positionNumber, basketPositions?.[0].positions.length, positionId)
      const depositAndWithdraw = getDepostAndWithdrawMsgs({ summary, address, basketPositions, positionId, hasPosition: basketPositions !== undefined && mintState.positionNumber <= basketPositions[0].positions.length })
      // console.log("depositAndWithdraw", depositAndWithdraw)
      //logs for mint msgs
      console.log("mintAndRepay", 
        address,
        positionId, mintState?.mint, mintState?.repay )
      const mintAndRepay = getMintAndRepayMsgs({
        address,
        positionId,
        mintAmount: mintState?.mint,
        repayAmount: mintState?.repay,
        chainName
      })
      //if repaying and updating assets, repay first
      if (mintState.repay > 0) {
        return [...mintAndRepay, ...depositAndWithdraw] as MsgExecuteContractEncodeObject[]
      }
      return [...depositAndWithdraw, ...mintAndRepay] as MsgExecuteContractEncodeObject[]
    },
    enabled: !!address && !mintState.overdraft,
  })

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['positions'] })
    queryClient.invalidateQueries({ queryKey: ['osmosis balances'] })
    setMintState({ positionNumber: 1, mint: 0, repay: 0, summary: [], reset: true })
    //Reset points queries
    queryClient.invalidateQueries({ queryKey: ['all users points'] })
    queryClient.invalidateQueries({ queryKey: ['one users points'] })
    queryClient.invalidateQueries({ queryKey: ['one users level'] })
  }
  console.log("mint msgs:", msgs)
  return useSimulateAndBroadcast({
    msgs,
    queryKey: ['mint_msg_sim', (msgs?.toString() ?? "0")],
    onSuccess,
    enabled: !!msgs
  })
}

export default useMint

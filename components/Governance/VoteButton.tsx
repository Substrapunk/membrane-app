import { CheckIcon } from '@chakra-ui/icons'
import { HStack, Text } from '@chakra-ui/react'
import React from 'react'
import useCastVote from './hooks/useCastVote'
import { ProposalVoteOption } from '@/contracts/codegen/governance/Governance.types'
import { TxButton } from '@/components/TxButton'
import { colors } from '@/config/defaults'
import { useVotingPower } from '@/hooks/useGovernance'

type Props = {
  show: boolean
  vote?: ProposalVoteOption | null
  proposalId: string
  isEnded?: boolean
}

const VoteButton = ({ show, vote, proposalId, isEnded = false }: Props) => {
  const castVote = useCastVote({
    proposalId: Number(proposalId),
    vote,
  }).action

  const { data: votingPower, isLoading } = useVotingPower(Number(proposalId))

  if (!show || isLoading) return null

  if (isEnded) return <Text color={colors.noState}>Voting period has ended</Text>

  if (Number(votingPower) === 0)
    return <Text color={colors.noState}>You have no voting power for this proposal</Text>

  return (
    <TxButton
      leftIcon={<CheckIcon />}
      px="5"
      w="fit-content"
      fontSize="sm"
      isDisabled={!!!vote}
      isLoading={castVote.tx.isPending}
      onClick={() => castVote.simulate.refetch().then(() => { castVote.tx.mutate() })}
      toggleConnectLabel={false}
    >
      Vote
    </TxButton>
  )
}

export default VoteButton

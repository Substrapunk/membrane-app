import contracts from '@/config/contracts.json'
import delegates from '@/config/delegates.json'
import {
  GovernanceClient,
  GovernanceQueryClient,
} from '@/contracts/codegen/governance/Governance.client'
import {
  Addr,
  Config,
  Proposal,
  ProposalResponse as ProposalResponseType,
  ProposalStatus,
} from '@/contracts/codegen/governance/Governance.types'
import { getCosmWasmClient, useCosmWasmClient } from '@/helpers/cosmwasmClient'
import { num } from '@/helpers/num'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

export const useGovernanceClient = () => {
  const { data: cosmWasmClient } = useCosmWasmClient()

  return useQuery({
    queryKey: ['gov_client', cosmWasmClient],
    queryFn: async () => {
      if (!cosmWasmClient) return null
      return new GovernanceQueryClient(cosmWasmClient, contracts.governance)
    },
    // enabled: true,
    // You might want to add staleTime to prevent unnecessary refetches
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const getGovernanceClient = async (rpcUrl: string) => {
  console.log("gov CW client")
  const cosmWasmClient = await getCosmWasmClient(rpcUrl)
  return new GovernanceQueryClient(cosmWasmClient, contracts.governance)
}

export const getSigningGovernanceClient = (signingClient: SigningCosmWasmClient, address: Addr) => {
  return new GovernanceClient(signingClient, address, contracts.governance)
}

type Ratio = {
  forRatio: number
  againstRatio: number
  amendRatio: number
  removeRatio: number
  alignRatio: number
}

export type ProposalResponse = ProposalResponseType & {
  badge: string
  status: ProposalStatus & ('completed' | 'pending')
  result: string
  ratio: Ratio
}

export const calcuateRatio = (proposal: ProposalResponse, config: Config) => {
  const { for_power, amendment_power, removal_power, against_power, aligned_power } = proposal

  const totalVotes = num(for_power).plus(against_power).plus(amendment_power).plus(removal_power)
  const forRatio = num(for_power).isZero()
    ? 0
    : num(for_power).div(totalVotes).times(100).dp(2).toNumber()
  const againstRatio = num(against_power).isZero()
    ? 0
    : num(against_power).div(totalVotes).times(100).dp(2).toNumber()
  const amendRatio = num(amendment_power).isZero()
    ? 0
    : num(amendment_power).div(totalVotes).times(100).dp(2).toNumber()
  const removeRatio = num(removal_power).isZero()
    ? 0
    : num(removal_power).div(totalVotes).times(100).dp(2).toNumber()

  const alignRatio = num(totalVotes).isZero()
    ? 0
    : num(aligned_power)
      .minus(config.proposal_required_stake)
      .plus(num(config.proposal_required_stake).sqrt())
      .dividedBy(totalVotes)
      .dp(2)
      .toNumber()
  return { forRatio, againstRatio, amendRatio, removeRatio, alignRatio }
}

export const calculateProposalResult = (proposal: ProposalResponseType, config: Config) => {
  let threshold = parseFloat(config.proposal_required_threshold)

  const { for_power, amendment_power, removal_power, against_power } = proposal
  var totalVotes = num(for_power).plus(amendment_power).plus(removal_power).plus(against_power)
  const hasMessages = !!proposal.messages

  if (hasMessages) {
    threshold = 0.5
  }

  if (num(for_power).div(totalVotes).gt(threshold)) {
    return 'For'
  } else if (num(amendment_power).div(totalVotes).gt(threshold)) {
    return 'Amend'
  } else if (num(removal_power).div(totalVotes).gt(threshold)) {
    return 'Remove'
  } else {
    return 'Against'
  }
}

const getDaysLeft = (proposal: any) => {
  const SECONDS_PER_DAY = 86400
  const SECONDS_PER_HOUR = 3600
  const SECONDS_PER_MINUTE = 60

  const votingPeriodInSeconds = (Math.max(proposal.delayed_end_block, proposal.end_block) - proposal.start_time) + 300 //Add 5 mins bc its been ending later than this calc for some reason

  const secondsRemaining = Math.max(
    votingPeriodInSeconds - (dayjs().unix() - proposal.start_time),
    0,
  )

  const days = Math.floor(secondsRemaining / SECONDS_PER_DAY)
  const hours = Math.floor((secondsRemaining % SECONDS_PER_DAY) / SECONDS_PER_HOUR)
  const minutes = Math.floor((secondsRemaining % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE)

  return { days, hours, minutes }
}

const parseProposal = (proposals: ProposalResponseType[]) => {
  // console.log("before parse", proposals)
  const activeProposals = proposals
    .filter(({ status }) => status === 'active')
    .map((proposal) => ({
      ...proposal,
      badge: 'active',
      daysLeft: getDaysLeft(proposal),
    }))

  const completedBadge: Record<string, string> = {
    passed: 'passed',
    rejected: 'rejected',
    amendment_desired: 'amended',
    expired: 'expired',
  }
  const completedProposals = proposals
    .filter(
      ({ status }) =>
        status === 'passed' ||
        status === 'rejected' ||
        status === 'amendment_desired' ||
        status === 'expired',
    )
    .map((proposal) => ({
      ...proposal,
      status: 'completed',
      badge: completedBadge[proposal.status],
    }))

  const executedProposals = proposals
    .filter(({ status }) => status === 'executed')
    .map((proposal) => ({
      ...proposal,
      badge: 'executed',
    }))
  const pendingProposals = proposals
    .filter(({ aligned_power }) => aligned_power < "1000000000")
    .map((proposal) => ({
      ...proposal,
      badge: 'pending',
    }))

  return [...activeProposals, ...completedProposals, ...executedProposals, ...pendingProposals]
}

export const getConfig = async (client: any) => {
  return client.config()
}

export const getProposals = async (client: any) => {
  const config = await getConfig(client)
  // const requiredQuorum = parseFloat(config.proposal_required_quorum)
  const requiredQuorum = num(config.proposal_required_quorum).times(100).toNumber()

  const start = 150
  const limit = 30 //Contract's max limit is 30 so we'll need to move the start point every 30 proposals

  var activeProposals = (await client.activeProposals({ start, limit }).then((res) => res.proposal_list)).filter((prop) => prop.proposal_id != "61")
  const secondProp = await client.proposal({ proposalId: 98 }).then((res) => res)
  activeProposals.push(secondProp)
  //filter out proposal 155
  activeProposals = activeProposals.filter((prop) => prop.proposal_id != "155")

  const pendingProposals = client.pendingProposals({}).then((res) => res.proposal_list)

  const statusOrder: Record<string, number> = {
    active: 0,
    pending: 1,
    complited: 2,
    executed: 3,
  }

  const allProposals = await Promise.all([activeProposals, pendingProposals])
    .then(([active, pending]) => [...active, ...pending])
    .then(parseProposal)
    .then((proposals) =>
      proposals.sort((a, b) => {
        return statusOrder[a.status] - statusOrder[b.status]
      }),
    )

  //   console.log(allProposals)
  // //Count the amount of times a delegate has voted for a proposal & save in an array
  // const delegateVotes = delegates.map((delegate) => {
  //   return [delegate.name, allProposals.filter((proposal) => proposal.for_voters?.includes(delegate.address) || proposal.against_voters?.includes(delegate.address) || proposal.aligned_voters?.includes(delegate.address) || proposal.removal_voters?.includes(delegate.address)).length]
  // })
  // console.log(delegateVotes)


  return allProposals.filter((prop) => prop.proposal_id != "61")
    .map((proposal) => ({
      ...proposal,
      result: calculateProposalResult(proposal, config),
      ratio: calcuateRatio(proposal, config),
      requiredQuorum,
    }))
}

const checkIfVoted = (proposal: Proposal, address?: Addr) => {
  if (!address)
    return {
      votedAgents: false,
      votedFor: false,
      votedAmend: false,
      votedRemove: false,
      votedAlign: false,
      voted: false,
    }
  let voted = false
  const votedAgents = proposal.against_voters?.includes(address)
  const votedFor = proposal.for_voters?.includes(address)
  const votedAmend = proposal.amendment_voters?.includes(address)
  const votedRemove = proposal.removal_voters?.includes(address)
  const votedAlign = proposal.aligned_voters?.includes(address)
  if (votedAgents || votedFor || votedAmend || votedRemove || votedAlign) {
    voted = true
  }
  return {
    votedAgents,
    votedFor,
    votedAmend,
    votedRemove,
    votedAlign,
    voted,
  }
}

const getTotalVotingPower = async (proposal: Proposal, client: any) => {

  return client.totalVotingPower({
    proposalId: Number(proposal.proposal_id),
  })
}

const getQuorum = async (proposal: Proposal, client: any) => {
  const config = await getConfig(client)
  const { against_power, for_power, aligned_power, amendment_power, removal_power } = proposal

  const totalVotingPower = await getTotalVotingPower(proposal, client)

  var standardized_align_power = num(aligned_power)
    .minus(config.proposal_required_stake)
    .plus(num(config.proposal_required_stake).sqrt())


  const power = num(against_power)
    .plus(for_power)
    .plus(standardized_align_power)
    .plus(amendment_power)
    .plus(removal_power)

  // const multiplier = num(100).div(totalVotingPower)

  const q = power.div(totalVotingPower).dp(2).toNumber()
  return num(q).isLessThan(1) ? num(q).times(100).toNumber() : q
}

export const getProposal = async (proposalId: number, client: any, address?: Addr) => {
  const proposal = await client.proposal({ proposalId })
  const quorum = await getQuorum(proposal, client)
  const vote = checkIfVoted(proposal, address)

  return {
    ...proposal,
    ...vote,
    quorum,
  }
}

export const getUserVotingPower = async (address: Addr, proposalId: number, client: any) => {
  return client.userVotingPower({
    user: address,
    proposalId,
    vesting: false,
  })
}

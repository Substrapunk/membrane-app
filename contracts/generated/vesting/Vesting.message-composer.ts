/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.7.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { Uint128, AllocationResponse, VestingPeriod, Addr, Config, ExecuteMsg, CosmosMsgForEmpty, BankMsg, StakingMsg, DistributionMsg, Binary, IbcMsg, Timestamp, Uint64, WasmMsg, GovMsg, VoteOption, ProposalVoteOption, ProposalMessage, Coin, Empty, IbcTimeout, IbcTimeoutBlock, InstantiateMsg, QueryMsg, AssetInfo, RecipientResponse, Allocation, Asset, RecipientsResponse, UnlockedResponse } from "./Vesting.types";
export interface VestingMsg {
  contractAddress: string;
  sender: string;
  addRecipient: ({
    recipient
  }: {
    recipient: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  removeRecipient: ({
    recipient
  }: {
    recipient: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  addAllocation: ({
    allocation,
    recipient,
    vestingPeriod
  }: {
    allocation: Uint128;
    recipient: string;
    vestingPeriod?: VestingPeriod;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  withdrawUnlocked: (_funds?: Coin[]) => MsgExecuteContractEncodeObject;
  claimFeesforContract: (_funds?: Coin[]) => MsgExecuteContractEncodeObject;
  claimFeesforRecipient: (_funds?: Coin[]) => MsgExecuteContractEncodeObject;
  submitProposal: ({
    description,
    expedited,
    link,
    messages,
    title
  }: {
    description: string;
    expedited: boolean;
    link?: string;
    messages?: ProposalMessage[];
    title: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  castVote: ({
    proposalId,
    vote
  }: {
    proposalId: number;
    vote: ProposalVoteOption;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  updateConfig: ({
    additionalAllocation,
    mbrnDenom,
    osmosisProxy,
    owner,
    stakingContract
  }: {
    additionalAllocation?: Uint128;
    mbrnDenom?: string;
    osmosisProxy?: string;
    owner?: string;
    stakingContract?: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class VestingMsgComposer implements VestingMsg {
  sender: string;
  contractAddress: string;

  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.addRecipient = this.addRecipient.bind(this);
    this.removeRecipient = this.removeRecipient.bind(this);
    this.addAllocation = this.addAllocation.bind(this);
    this.withdrawUnlocked = this.withdrawUnlocked.bind(this);
    this.claimFeesforContract = this.claimFeesforContract.bind(this);
    this.claimFeesforRecipient = this.claimFeesforRecipient.bind(this);
    this.submitProposal = this.submitProposal.bind(this);
    this.castVote = this.castVote.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
  }

  addRecipient = ({
    recipient
  }: {
    recipient: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          add_recipient: {
            recipient
          }
        })),
        funds: _funds
      })
    };
  };
  removeRecipient = ({
    recipient
  }: {
    recipient: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          remove_recipient: {
            recipient
          }
        })),
        funds: _funds
      })
    };
  };
  addAllocation = ({
    allocation,
    recipient,
    vestingPeriod
  }: {
    allocation: Uint128;
    recipient: string;
    vestingPeriod?: VestingPeriod;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          add_allocation: {
            allocation,
            recipient,
            vesting_period: vestingPeriod
          }
        })),
        funds: _funds
      })
    };
  };
  withdrawUnlocked = (_funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          withdraw_unlocked: {}
        })),
        funds: _funds
      })
    };
  };
  claimFeesforContract = (_funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          claim_feesfor_contract: {}
        })),
        funds: _funds
      })
    };
  };
  claimFeesforRecipient = (_funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          claim_feesfor_recipient: {}
        })),
        funds: _funds
      })
    };
  };
  submitProposal = ({
    description,
    expedited,
    link,
    messages,
    title
  }: {
    description: string;
    expedited: boolean;
    link?: string;
    messages?: ProposalMessage[];
    title: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          submit_proposal: {
            description,
            expedited,
            link,
            messages,
            title
          }
        })),
        funds: _funds
      })
    };
  };
  castVote = ({
    proposalId,
    vote
  }: {
    proposalId: number;
    vote: ProposalVoteOption;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          cast_vote: {
            proposal_id: proposalId,
            vote
          }
        })),
        funds: _funds
      })
    };
  };
  updateConfig = ({
    additionalAllocation,
    mbrnDenom,
    osmosisProxy,
    owner,
    stakingContract
  }: {
    additionalAllocation?: Uint128;
    mbrnDenom?: string;
    osmosisProxy?: string;
    owner?: string;
    stakingContract?: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          update_config: {
            additional_allocation: additionalAllocation,
            mbrn_denom: mbrnDenom,
            osmosis_proxy: osmosisProxy,
            owner,
            staking_contract: stakingContract
          }
        })),
        funds: _funds
      })
    };
  };
}
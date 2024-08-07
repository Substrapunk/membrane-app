/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.35.3.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Uint128 = string;
export type Uint256 = string;
export type Addr = string;
export interface ClaimCheck {
  cdp_pending_revenue: Uint128;
  lq_pending_claims: ClaimsResponse[];
  sp_pending_claims: Coin[];
  user: Addr;
  vote_pending: number[];
}
export interface ClaimsResponse {
  bid_for: string;
  pending_liquidated_collateral: Uint256;
}
export interface Coin {
  amount: Uint128;
  denom: string;
  [k: string]: unknown;
}
export type Decimal = string;
export interface Config {
  cdt_denom: string;
  governance_contract: Addr;
  liq_queue_contract: Addr;
  max_mbrn_distribution: Uint128;
  mbrn_per_point: Decimal;
  oracle_contract: Addr;
  osmosis_proxy_contract: Addr;
  owner: Addr;
  points_per_dollar: Decimal;
  positions_contract: Addr;
  stability_pool_contract: Addr;
  total_mbrn_distribution: Uint128;
}
export type ExecuteMsg = {
  update_config: {
    cdt_denom?: string | null;
    governance_contract?: string | null;
    liq_queue_contract?: string | null;
    max_mbrn_distribution?: Uint128 | null;
    mbrn_per_point?: Decimal | null;
    oracle_contract?: string | null;
    osmosis_proxy_contract?: string | null;
    owner?: string | null;
    points_per_dollar?: Decimal | null;
    positions_contract?: string | null;
    stability_pool_contract?: string | null;
    total_mbrn_distribution?: Uint128 | null;
  };
} | {
  check_claims: {
    cdp_repayment: boolean;
    lq_claims: boolean;
    sp_claims: boolean;
    vote?: number[] | null;
  };
} | {
  give_points: {
    cdp_repayment: boolean;
    lq_claims: boolean;
    sp_claims: boolean;
    vote?: number[] | null;
  };
} | {
  liquidate: {
    position_id: Uint128;
    position_owner: string;
  };
} | {
  claim_m_b_r_n: {};
};
export interface InstantiateMsg {
  cdt_denom: string;
  governance_contract: string;
  liq_queue_contract: string;
  oracle_contract: string;
  osmosis_proxy_contract: string;
  positions_contract: string;
  stability_pool_contract: string;
}
export type QueryMsg = {
  config: {};
} | {
  claim_check: {};
} | {
  user_stats: {
    limit?: number | null;
    start_after?: string | null;
    user?: string | null;
  };
};
export interface UserStatsResponse {
  stats: UserStats;
  user: Addr;
}
export interface UserStats {
  claimable_points: Decimal;
  total_points: Decimal;
}
import { AssetWithBalance } from '@/components/Mint/hooks/useCombinBalance'
import { Summary } from '@/components/Mint/hooks/useMintState'
import { Asset } from '@/helpers/chain'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type ActionMenu = {
  value: string
  label: string
}

export type QuickActionState = {
  selectedAsset?: AssetWithBalance
  assets: AssetWithBalance[]
  summary?: Summary[]
  totalUsdValue?: number
  mint?: number
  swapInsteadofMint: boolean
  action: ActionMenu
}

type Store = {
  quickActionState: QuickActionState
  setQuickActionState: (partialState: Partial<QuickActionState>) => void
}

const initialState: QuickActionState = {  
  assets: [],
  swapInsteadofMint: false,
  action: {value: "LP", label: "LP"},
}

// @ts-ignore
const store = (set) => ({
  quickActionState: initialState,
  setQuickActionState: (partialState: Partial<QuickActionState>) =>
    set(
      (state: Store) => ({ quickActionState: { ...state.quickActionState, ...partialState } }),
      false,
      `@update/${Object.keys(partialState).join(',')}`,
    ),
})

// @ts-ignore
const useQuickActionState = create<Store>(devtools(store, { name: 'quickActionState' }))

export default useQuickActionState
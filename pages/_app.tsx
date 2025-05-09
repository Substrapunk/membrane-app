import theme from '@/theme'
import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { SignerOptions } from '@cosmos-kit/core'
import { ChainProvider } from '@cosmos-kit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { assets, chains } from 'chain-registry'
import { wallets as cosmostationWallets } from '@cosmos-kit/cosmostation'
import { wallets as keplrWallets } from '@cosmos-kit/keplr'
import { wallets as keplrMobile } from '@cosmos-kit/keplr-mobile'
import { wallets as leapWallets } from '@cosmos-kit/leap'
import { wallets as leapMobile } from '@cosmos-kit/leap-mobile'
import { wallets as ledgerWallets } from '@cosmos-kit/ledger'
import { wallets as stationWallets } from '@cosmos-kit/station'
import { wallets as tailwindWallets } from '@cosmos-kit/tailwind'
import { Chain } from '@chain-registry/types'
import WalletModal from '@/components/WalletModal'
import { aminoTypes, registry, rpcUrl } from '@/config/defaults'
import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'

// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
//pnpm install @cosmos-kit/keplr-mobile@^2.4.3
// import '@interchain-ui/react/styles'
// import MembersRules from '@/components/MembersRules'

const signerOptions: SignerOptions = {
  signingStargate: () => {
    return {
      aminoTypes,
      registry,
      gasPrice: GasPrice.fromString('0.01uosmo'),
    }
  },
  signingCosmwasm: (chain: Chain) => {
    switch (chain.chain_name) {
      case 'osmosis':
      case 'osmosistestnet5':
        return {
          gasPrice: GasPrice.fromString('0.01uosmo'),
        }
    }
  },
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // useErrorBoundary: true,
      staleTime: 300000, // 300 seconds
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
})

import '../styles/global.css';
import { GasPrice } from '@cosmjs/stargate'
import useAppState from '@/persisted-state/useAppState'
const App = ({ Component, pageProps }: AppProps) => {

  const { appState, setAppState } = useAppState()
  if (appState?.rpcUrl === undefined) {
    setAppState({ rpcUrl: rpcUrl });
  }
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) return null

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider resetCSS theme={theme}>
        <ChainProvider
          sessionOptions={{
            duration: 1000 * 60 * 60 * 24 * 7, // 7 days
          }}
          // allowedIframeParentOrigins={['http://localhost:*', 'https://*.abstract.money']}
          chains={chains}
          assetLists={assets}
          wallets={[
            ...keplrWallets?.slice(0, 1),
            ...keplrMobile?.slice(0, 1),
            ...cosmostationWallets?.slice(0, 1),
            ...ledgerWallets?.slice(0, 1),
            ...leapWallets?.slice(0, 1),
            ...leapMobile?.slice(0, 1),
            ...stationWallets?.slice(0, 1),
            ...tailwindWallets?.slice(0, 1),
          ]}
          walletModal={WalletModal}
          signerOptions={signerOptions}
          endpointOptions={{
            isLazy: true,
            endpoints: {
              osmosis: {
                rpc: [appState.rpcUrl],
              },
            },
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChainProvider>
      </ChakraProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}

export default App

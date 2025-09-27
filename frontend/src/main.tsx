import '@rainbow-me/rainbowkit/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider,darkTheme} from '@rainbow-me/rainbowkit';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient();
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {sepolia , arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains';

const config = getDefaultConfig({
  appName: 'Block_Butler',
  projectId: 'd5699a6db2876b16bc7d50bb07f73934',
  chains: [sepolia ,mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)

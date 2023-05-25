import React from "react";
import VotingComponent from "./components/VotingComponent";
import {
  CssBaseline,
  ThemeProvider,
  Box,
} from "@mui/material";

import Theme from "./themes/Theme";
import '@rainbow-me/rainbowkit/styles.css';
import { Buffer } from 'buffer';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, localhost, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

window.global = window.global ?? window;
window.Buffer = window.Buffer ?? Buffer;
window.process = window.process ?? { env: {} };


const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    localhost,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit demo',
  projectId: 'P05ecb9a7ba743c4488b4c8a8a176d6d5',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function App() {




  return (
    <ThemeProvider theme={Theme}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider

          chains={chains}
        >
          <Box>
            <CssBaseline />
            <Box
              sx={{
                minHeight: "100vh",
                position: "relative",
              }}
            >
              <VotingComponent />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "100px",
                  }}
                >
                </Box>
              </Box>
            </Box>
          </Box>
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
}

export default App;

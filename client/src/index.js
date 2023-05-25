import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import '@rainbow-me/rainbowkit/styles.css';
import { Buffer } from 'buffer';
import { getDefaultWallets, RainbowKitProvider, midnightTheme } from '@rainbow-me/rainbowkit';
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


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={midnightTheme({
          accentColor: '#37b78c',
          overlayBlur: 'small',

        })} >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

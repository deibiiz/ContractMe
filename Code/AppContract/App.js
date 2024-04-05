import "./globals.js";
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import '@walletconnect/react-native-compat'
import { WagmiConfig } from 'wagmi'
import { sepolia } from 'viem/chains'
import { createWeb3Modal, defaultWagmiConfig, Web3Modal } from '@web3modal/wagmi-react-native'
import { useWeb3Modal } from '@web3modal/wagmi-react-native'
import { useAccount, useDisconnect, useContractWrite } from 'wagmi'
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";
import Navigation from './src/Navigation';
import { NavigationContainer } from "@react-navigation/native";
import Wallet from './src/screens/Wallet';

const projectId = '8557e5243602df187aa5977b31f1ebca';

const metadata = {
  name: 'YOUR_PROJECT_NAME',
  description: 'YOUR_PROJECT_DESCRIPTION',
  url: 'https://your-project-website.com/',
  icons: ['https://your-project-logo.com/'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
}

const chains = [sepolia]

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
})

export default function App() {

  return (
    <WagmiConfig config={wagmiConfig}>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>

      <Web3Modal />
    </WagmiConfig>
  );
}

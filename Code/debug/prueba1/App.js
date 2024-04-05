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
import ABI from './src/ContractConexion/MyContractAux.json'
import Home from './src/Screens/Wallet'
import Navigation from './src/Navigation';
import { NavigationContainer } from '@react-navigation/native';

const projectId = '8557e5243602df187aa5977b31f1ebca';

const metadata = {
  name: 'ContractMe',
  description: 'Crea contratos de manera sencilla y segura.',
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

/*

function Home() {
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect()
  const { isConnected, address } = useAccount()
  const [IsContractSigned, setIsContractSigned] = useState();
  const [TxHash, setTxHash] = useState('');

  console.log('Estado de conexión:', isConnected ? 'Conectado' : 'Desconectado');

  const { writeAsync } = useContractWrite({
    address: '0x3eA2717cf5AE3ccc89d868fB317aE938b6aC8EBc',
    abi: ABI,
    functionName: 'mint',
  })

  async function isContractSigned() {
    const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/d2fa416c31e348ef82c706d0a1e24fc8');
    const contractAddress = '0x3eA2717cf5AE3ccc89d868fB317aE938b6aC8EBc';
    const contract = new ethers.Contract(contractAddress, ABI, provider);
    const result = await contract.isContractSigned(6);
    var resNum = Number(result);
    setIsContractSigned(resNum.toString());
    console.log(result);
  }

  async function writeToContract() {
    // Asegúrate de tener una dirección desde la cual estás enviando la transacción.
    if (!address) {
      console.error('Wallet not connected');
      return;
    }

    // Asume que ya tienes definidos o puedes obtener los valores para _to, _salary, _start, _duration, _description, _title
    const _to = "0x922Fd344AE304f3baC6b2f5f459E056ADFC2cf24"; // Por ejemplo, usar la dirección conectada
    const _salary = ethers.utils.parseEther('0.001'); // Convertir 1 ether a wei, ajusta según necesidad
    const _salaryNumber = Number(_salary); // Convertir 1 ether a wei, ajusta según necesidad
    const _start = Number(1); // Fecha de inicio en segundos desde epoch, ajusta según necesidad
    const _duration = Number(360000); // Duración en segundos, ajusta según necesidad
    const _description = "Description of the minted item2"; // Descripción
    const _title = "Title of the minted item2"; // Título

    const tx = await writeAsync({
      args: [
        _to,
        _salaryNumber,
        _start,
        _duration,
        _description,
        _title,
      ],
      value: _salaryNumber,
    });

    console.log(tx);
    setTxHash(tx.hash);
  }

  async function signToContract() {

    const _tokenID = Number(6);

    const tx = await writeAsync({
      args: [
        _tokenID,
      ],
    });

    console.log(tx);
    setTxHash(tx.hash);
  }


  return (
    <View style={styles.container}>
      {IsContractSigned &&
        <Text>
          Result: {IsContractSigned}
        </Text>
      }
      <Button
        onPress={isContractSigned}
        title={"read"}
      />

      {TxHash &&
        <Text>
          Transaction: {TxHash}
        </Text>
      }
      <Button
        onPress={writeToContract}
        title={"write"}
      />
      <Button
        onPress={signToContract}
        title={"sign"}
      />

      <Button
        onPress={!isConnected ? open : disconnect}
        title={isConnected ? 'Disconnect' : 'Connect'}
      />
      {isConnected && (
        <>
          <Text style={styles.text}>{address}</Text>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/
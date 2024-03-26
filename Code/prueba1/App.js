import React, { useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import {
  WalletConnectModal,
  useWalletConnectModal,
} from '@walletconnect/modal-react-native';
import { MyContract1, web3 } from './web3';
import 'react-native-get-random-values';

const projectId = '8557e5243602df187aa5977b31f1ebca';

const providerMetadata = {
  name: 'YOUR_PROJECT_NAME',
  description: 'YOUR_PROJECT_DESCRIPTION',
  url: 'https://your-project-website.com/',
  icons: ['https://your-project-logo.com/'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com',
  },
};

function App() {

  const { address, open, isConnected, provider } = useWalletConnectModal();

  const handleConnection = () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    return open();
  };

  async function isContractSigned() {
    const result = await MyContract1.methods.isContractSigned(0).call();
    console.log(result);
  }


  async function writeToContract() {
    // Asegúrate de tener una dirección desde la cual estás enviando la transacción.
    if (!address) {
      console.error('Wallet not connected');
      return;
    }

    // Asume que ya tienes definidos o puedes obtener los valores para _to, _salary, _start, _duration, _description, _title
    const _to = "0x97970830d52Cd8Cb486eFc4eaef64aA7385d856e"; // Por ejemplo, usar la dirección conectada
    const _salary = web3.utils.toWei('0.001', 'ether'); // Convertir 1 ether a wei, ajusta según necesidad
    const _start = Number(1000); // Fecha de inicio en segundos desde epoch, ajusta según necesidad
    const _duration = Number(3600); // Duración en segundos, ajusta según necesidad
    const _description = "Description of the minted item"; // Descripción
    const _title = "Title of the minted item"; // Título

    // Llama al método mint con los argumentos requeridos
    const mintMethod = MyContract1.methods.mint(_to, _salary, _start, _duration, _description, _title);

    // Estimar el gas de la transacción
    const gas = await mintMethod.estimateGas({ from: address });

    // Obtener el precio actual del gas (opcional)
    const gasPrice = await web3.eth.getGasPrice();

    // Enviar la transacción
    mintMethod.send({ from: address, gas: 10000000, gasPrice, value: _salary }) // Asegúrate de ajustar el valor de 'value' si tu función lo requiere
      .on('transactionHash', function (hash) {
        console.log('Transaction hash:', hash);
      })
      .on('receipt', function (receipt) {
        console.log('Receipt:', receipt);
      })
      .on('error', console.error); // Si hay un error
  }





  return (
    <View style={styles.container}>
      <Button
        onPress={handleConnection}
        title={isConnected ? 'Disconnect' : 'Connect'}
      />

      <Button
        onPress={isContractSigned}
        title={"console log"}
      />

      <Button
        onPress={writeToContract}
        title={"write"}
      />

      {isConnected && (
        <>
          <Text style={styles.text}>{address}</Text>
        </>
      )}

      <WalletConnectModal
        projectId={projectId}
        providerMetadata={providerMetadata}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});

export default App;
import React, { useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import Web3 from 'web3';
import {
  WalletConnectModal,
  useWalletConnectModal,
} from '@walletconnect/modal-react-native';

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
  const [messageSigned, setMessageSigned] = useState(undefined);

  const { address, open, isConnected, provider } = useWalletConnectModal();

  const handleConnection = () => {
    if (isConnected) {
      return provider?.disconnect();
    }

    return open();
  };

  const signMessage = async () => {
    if (!isConnected || !provider || !address) {
      console.log('Wallet is not connected or address is not available');
      return;
    }

    const message = "Este es un mensaje a firmar";
    const hexMessage = Web3.utils.utf8ToHex(message);

    try {
      const signature = await provider.request({
        method: 'personal_sign',
        params: [hexMessage, address],
      });
      console.log('Signature:', signature);
      setMessageSigned(true);
    } catch (error) {
      console.error('Error signing message:', error);
      setMessageSigned(false);
    }
  };


  return (
    <View style={styles.container}>
      <Button
        onPress={handleConnection}
        title={isConnected ? 'Disconnect' : 'Connect'}
      />

      {isConnected && (
        <>
          <Text style={styles.text}>{address}</Text>
          <Button onPress={signMessage} title="Sign message" />

          {messageSigned !== undefined && (
            <Text style={styles.text}>
              {messageSigned === true ? 'Message Signed' : 'Message not signed'}
            </Text>
          )}
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
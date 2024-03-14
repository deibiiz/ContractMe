// App.js
import React from 'react';
import "./globals.js";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WalletConnectProvider, useWalletConnect } from '@walletconnect/react-native-dapp';

const WalletConnectComponent = () => {
  const connector = useWalletConnect();

  const connectWallet = () => {
    if (!connector.connected) {
      connector.connect();
    }
  };

  const disconnectWallet = () => {
    if (connector.connected) {
      connector.killSession();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={connectWallet}>
        <Text style={styles.buttonText}>Conectar Cartera</Text>
      </TouchableOpacity>
      {connector.connected && (
        <View>
          <Text style={styles.connectedText}>Cartera Conectada:</Text>
          <Text style={styles.addressText}>{connector.accounts[0]}</Text>
          <TouchableOpacity style={styles.button} onPress={disconnectWallet}>
            <Text style={styles.buttonText}>Desconectar Cartera</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const App = () => {
  return (
    <WalletConnectProvider
      redirectUrl={Platform.OS === 'web' ? window.location.origin : 'yourappscheme://'}
      storageOptions={{
        asyncStorage: AsyncStorage,
      }}
      clientMeta={{
        description: 'Connect with WalletConnect',
        url: 'https://walletconnect.org',
        icons: ['https://walletconnect.org/walletconnect-logo.png'],
        name: 'WalletConnect',
      }}
    >
      <SafeAreaView style={styles.safeArea}>
        <WalletConnectComponent />
      </SafeAreaView>
    </WalletConnectProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    color: '#ffffff',
  },
  connectedText: {
    marginTop: 20,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default App;

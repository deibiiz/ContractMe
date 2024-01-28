import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthentication } from './src/Authentication';
import "react-native-gesture-handler";
import Login from "./src/screens/Login";
import Navigation from './src/Navigation';
import { AccountProvider } from './src/components/ContextoCuenta';



export default function App() {
  const { esAutenticado, AutenticarConHuella, AutenticarDirecto } = useAuthentication();

  return (
    <AccountProvider>
      {!esAutenticado ? (
        <View style={styles.mainContainer}>
          <Login AutenticarConHuella={AutenticarConHuella} AutenticarDirecto={AutenticarDirecto} />
        </View>
      ) : (
        <Navigation />
      )}
    </AccountProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#F6F9FC',
    flex: 1,
  },
});

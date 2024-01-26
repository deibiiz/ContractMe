import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthentication } from './src/Authentication';
import "react-native-gesture-handler";
import Login from "./src/screens/Login";
import Navigation from './src/Navigation';



export default function App() {
  const { esAutenticado, AutenticarConHuella, AutenticarDirecto } = useAuthentication();

  if (!esAutenticado) {
    return (
      <View style={styles.mainContainer}>
        <Login AutenticarConHuella={AutenticarConHuella} AutenticarDirecto={AutenticarDirecto} />
      </View>
    );
  }

  return <Navigation />;
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#F6F9FC',
    flex: 1,
  },
});

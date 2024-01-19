import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import "react-native-gesture-handler";
import Login from "./src/screens/Login";
import Navigation from './src/Navigation';

export default function App() {
  const [soportaBiometrico, setSoportaBiometrico] = useState(false);
  const [esAutenticado, setEsAutenticado] = useState(false);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setSoportaBiometrico(compatible);
    })();
  }, []);

  const AutenticarConHuella = async () => {
    try {
      if (soportaBiometrico) {
        const resultado = await LocalAuthentication.authenticateAsync({
          promptMessage: "Ingresar con huella digital"
        });
        setEsAutenticado(resultado.success);
      } else {
        alert("Este dispositivo no soporta autenticación biométrica .");
      }
    } catch (error) {
      console.error("Error en autenticación biométrica", error);
    }
  };

  const AutenticarDirecto = () => {
    setEsAutenticado(true);
  };

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

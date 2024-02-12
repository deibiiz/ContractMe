import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Path } from "react-native-svg";
import Boton from '../components/Boton';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseAuth } from './firebaseConfig';
import { useAuthentication } from './Authentication';

const { width, height } = Dimensions.get("window")

export default function Login({ AutenticarDirecto, AutenticarConHuella, navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const loginUsuario = () => {
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        AutenticarDirecto();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }

  function SvgTop() { // obtenido desde SVGR
    return (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={1800}
        height={100}
        fill="none"
      >
        <Path fill="#164863" d="M0 0h1800v250H0V0Z" />
      </Svg>
    )
  }

  return (
    <View>
      <View style={styles.containerSVG}>
        <SvgTop />
        <Text style={styles.titulo}> ContractMe </Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.subtitulo}> Inicia sesión en tu cuenta </Text>
        <TextInput
          placeholder='david@gmail.com'
          onChangeText={setEmail}
          style={styles.textoInput}
        />
        <TextInput
          placeholder='Contraseña'
          onChangeText={setPassword}
          style={styles.textoInput}
          secureTextEntry={true}
        />
        <Boton
          texto="Iniciar sesión"
          onPress={loginUsuario}
          estiloBoton={{
            width: 180,
            marginTop: 15,
          }}
        />

        <Boton
          texto="Acceso Biométrico"
          onPress={AutenticarConHuella}
          estiloBoton={{
            width: 280,
            marginTop: 25,
            marginBottom: 25,
            borderRadius: 15,
          }}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.olvidoContraseña}> ¿No tienes una cuenta? </Text>
            <Text style={styles.olvidoContraseña1}> Regístrate </Text>
          </View>
        </TouchableOpacity>


        <TouchableOpacity onPress={AutenticarDirecto}>
          <Text style={{ marginTop: 200 }}> acceso directo para desarrollo </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSVG: {
    width: width,
    justifyContent: 'flex-start',
    alignItems: "center",
  },
  titulo: {
    marginTop: 40,
    fontSize: 60,
    color: "black",
    fontWeight: "bold",
  },
  subtitulo: {
    marginTop: 80,
    fontSize: 21,
    color: "#403E3D",
  },
  olvidoContraseña: {
    fontSize: 18,
    color: "#403E3D",
    marginTop: 15,
  },
  olvidoContraseña1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#164863",
    marginTop: 15,
  },
  textoInput: {
    padding: 10,
    paddingStart: 20,
    borderWidth: 0.4,
    borderColor: "gray",
    width: "80%",
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: "white"
  },
});


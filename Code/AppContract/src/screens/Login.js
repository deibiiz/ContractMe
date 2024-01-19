import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Dimensions } from 'react-native';
import Svg, { Stop, Path, Defs } from "react-native-svg";
import Boton from '../components/Boton';
const { width, height } = Dimensions.get("window")

export default function Login({ AutenticarConHuella, AutenticarDirecto }) {

  function SvgTop() { // obtenido desde SVGR
    return (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={1800}
        height={100}
        fill="none"
      >
        <Path fill="#2BA6FF" d="M0 0h1800v250H0V0Z" />
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
          style={styles.textoInput}
        />
        <TextInput
          placeholder='Contraseña'
          style={styles.textoInput}
          secureTextEntry={true}
        />
        <Text style={styles.olvidoContraseña}> ¿Ha olvidado su contraña? </Text>
        <Boton
          texto="Iniciar sesión"
          onPress={AutenticarDirecto}
        />
        <Text style={styles.olvidoContraseña}> No tengo cuenta </Text>
        <Boton
          texto="Acceso Biométrico"
          onPress={AutenticarConHuella}
          colores={["#AEDDF5", "#12B0FF"]}
          estiloBoton={{
            width: 280,
            marginTop: 20,
            borderRadius: 15,
          }}
        />

        <StatusBar style="auto" />
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
    color: "gray"
  },
  olvidoContraseña: {
    fontSize: 14,
    color: "gray",
    marginTop: 20,
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

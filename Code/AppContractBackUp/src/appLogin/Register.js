import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions } from 'react-native';
import Boton from '../components/Boton';
import { useNavigation } from "@react-navigation/native";
import { firebaseAuth } from './firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';




const { width, height } = Dimensions.get("window")

export default function Register({ AutenticarConHuella, AutenticarDirecto }) {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const registrarUsuario = () => {
        createUserWithEmailAndPassword(firebaseAuth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);

                sendEmailVerification(user)
                    .then(() => {
                        alert("Se ha enviado un correo de verificación");
                        navigation.goBack();
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode, errorMessage);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    }

    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.subtitulo}> Introduce tus datos </Text>
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
                    texto="Registrarse"
                    onPress={registrarUsuario}
                    estiloBoton={{
                        width: 280,
                        marginTop: 25,
                        borderRadius: 15,
                    }}
                />
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
        marginTop: 15,
    },
    textoInput: {
        padding: 10,
        paddingStart: 20,
        borderWidth: 0.4,
        borderColor: "gray",
        width: "80%",
        marginTop: 20,
        borderRadius: 5,
        backgroundColor: "white",
        color: "gray",
    },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import Boton from '../components/Boton';
import { firebaseAuth } from './firebaseConfig';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';


export default function ResetPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');

    const ResetPassword = () => {
        sendPasswordResetEmail(firebaseAuth, email)
            .then(() => {
                alert("Se ha enviado un correo para restablecer la contraseña");
                navigation.goBack();
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    }



    return (
        <View style={styles.container}>
            <Text style={styles.textoAviso}>Introduce tu correo electrónico</Text>
            <TextInput
                placeholder='david@gmail.com'
                value={email}
                onChangeText={setEmail}
                style={styles.textoInput}
            />

            <Boton
                texto="Enviar Correo de Restablecimiento"
                onPress={ResetPassword}
                estiloBoton={{
                    width: "75%",
                    marginTop: 10,
                    borderRadius: 10,
                }}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    textoAviso: {
        marginTop: 80,
        fontSize: 21,
        color: "gray"
    },
    textoInput: {
        padding: 10,
        paddingStart: 20,
        borderWidth: 0.4,
        borderColor: "gray",
        color: "gray",
        width: "80%",
        marginTop: 20,
        borderRadius: 5,
        backgroundColor: "white"
    },
});
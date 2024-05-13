import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Boton from "../components/Boton";



const LoginScreen = () => {

    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const data = await AsyncStorage.getAllKeys();
        console.log(data, "async")

        try {
            //const response = await signInWithEmailAndPassword(auth, email, password);
            const response = await signInWithEmailAndPassword(auth, "admin1@gmail.com", "admin1");
            setUser(response.user);
            setError("");

            if (user) {
                console.log("Usuario logueado");
            }
        } catch (err) {
            setError(err.message);
            console.log(err.message);
        }
    };



    return (
        <View style={styles.container}>
            <View style={styles.authContainer}>
                <Text style={styles.title}>{"Inicio de sesión"}</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    placeholder="Email"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    placeholder="Contraseña"
                    autoCapitalize="none"
                    secureTextEntry={true}
                />
                <Boton
                    texto="Acceder"
                    onPress={handleLogin}
                    estiloBoton={{
                        borderRadius: 5,
                        marginTop: 10,
                        marginBottom: 10,
                        width: "100%",
                    }}
                    estiloTexto={{
                        fontSize: 17,
                    }}
                />
                {error ? <Text style={styles.WarningText}>{error}</Text> : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#f0f0f0",
    },
    authContainer: {
        width: "90%",
        maxWidth: 400,
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        marginTop: 16,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        height: 40,
        borderColor: "#ddd",
        borderWidth: 1,
        marginBottom: 16,
        padding: 8,
        borderRadius: 4,
    },
    WarningText: {
        width: "100%",
        textAlign: "center",
        marginBottom: 10,
        fontStyle: "italic",
    },
});

export default LoginScreen;

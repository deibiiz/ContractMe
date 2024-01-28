import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { MyContract1 } from "../ether/web3.js";
import Boton from "../components/Boton.js";
import web3 from "web3";
import { useAccount } from "../components/ContextoCuenta";

export default function SignContract() {
    const [tokenId, setTokenId] = useState('');
    const [signStatus, setSignStatus] = useState('');
    const { selectedAccount } = useAccount();

    const signTheContract = async () => {
        if (!tokenId) {
            alert('Por favor, introduce el ID del contrato.');
            return;
        }

        try {
            if (!selectedAccount) {
                alert('Por favor, inicia sesión en MetaMask y selecciona una cuenta.');
                return;
            }

            await MyContract1.methods.signContract(tokenId)
                .send({ from: selectedAccount, gas: 1000000 });

            setSignStatus(`Contrato con ID: ${tokenId} firmado exitosamente.`);
        } catch (error) {
            console.error("Error al firmar el contrato:", error);
            setSignStatus("Error al firmar el contrato");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setTokenId}
                value={tokenId}
                placeholder="Introduce el ID del contrato"
                keyboardType="numeric"
            />
            <Boton
                texto="Firmar Contrato"
                onPress={signTheContract}
                estiloBoton={
                    {
                        borderRadius: 5,
                        marginTop: 10,
                        width: 200,
                    }
                }
            />
            <Text>{signStatus}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%'
    },

});
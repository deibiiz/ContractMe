import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { MyContract1 } from "../ether/web3.js";

export default function infoContract() {
    const [tokenId, setTokenId] = useState('');
    const [contractStatus, setContractStatus] = useState('');

    const checkContractStatus = async () => {
        if (!tokenId) {
            alert('Por favor, introduce un ID de token válido.');
            return;
        }

        try {
            const isPaused = await MyContract1.methods.isContractPaused(tokenId).call();
            setContractStatus(isPaused ? "Pausado" : "No Pausado");
        } catch (error) {
            console.error("Error al interactuar con el contrato:", error);
            setContractStatus("Error al obtener los datos");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setTokenId}
                value={tokenId}
                placeholder="Introduce el ID del Token"
                keyboardType="numeric"
            />
            <Button
                title="Verificar Estado del Contrato"
                onPress={checkContractStatus}
            />
            <Text>Estado del Contrato: {contractStatus}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
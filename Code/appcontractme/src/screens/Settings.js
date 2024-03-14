import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useEffect, useContext } from 'react';
import Web3 from 'web3';
import { web3 } from "../ether/web3";
import { useAccount } from "../components/ContextoCuenta.js"; // Asegúrate de que la ruta sea correcta

export default function Settings() {
    const { selectedAccount, isConnected } = useAccount();

    const enviarETH = async () => {
        if (!isConnected) {
            console.error("No hay una cuenta conectada.");
            return;
        }

        try {
            const cuentaReceptora = "0x922Fd344AE304f3baC6b2f5f459E056ADFC2cf24"; // Define la cuenta receptora
            const cantidad = web3.utils.toWei('0.01', 'ether'); // La cantidad a enviar en wei

            // Construye la transacción con EIP-1559
            const tx = {
                from: selectedAccount,
                to: cuentaReceptora,
                value: cantidad,
                gas: "0x5208", // Establece un límite de gas adecuado
                maxPriorityFeePerGas: "0x3b9aca00", // Nuevo campo para EIP-1559
                maxFeePerGas: "0x2540be400", // Nuevo campo para EIP-1559
            };

            console.log('Transacción a enviar:', tx);

            const txHash = await web3.eth.sendTransaction(tx);
            console.log("Hash de la transacción:", txHash);
        } catch (error) {
            console.error("Error al enviar la transacción:", error);
        }

    };


    return (
        <View style={styles.container}>
            <Text>PANTALLA TESTEO</Text>
            <Button
                title="Enviar ETH"
                onPress={enviarETH} // Llama a enviarETH cuando el botón es presionado
            />
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

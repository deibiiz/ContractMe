import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { MyContract1 } from "../ether/web3.js";
import Web3 from "web3";
import Boton from "../components/Boton.js";
import { useAccount } from "../components/ContextoCuenta.js";


export default function CreateContract() {
    const [title, setTitle] = useState('');
    const [recipient, setRecipient] = useState('');
    const [salary, setSalary] = useState('');
    const [start, setStart] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [mintStatus, setMintStatus] = useState('');
    const { selectedAccount } = useAccount();

    if (!selectedAccount) {
        alert('Por favor, inicia sesión en MetaMask y selecciona una cuenta.');
    }

    const mintContract = async () => {
        if (!salary || !start || !duration || !description || !title) {
            alert('Por favor, introduce todos los datos.');
            return;
        }

        try {
            const web3 = new Web3(window.ethereum);
            if (!selectedAccount) {
                alert('Por favor, inicia sesión en MetaMask y selecciona una cuenta.');
                return;
            }

            const accounts = await web3.eth.getAccounts();
            const parsedSalary = web3.utils.toWei(salary, 'ether');
            const parsedStart = Number(start);
            const parsedDuration = Number(duration);
            const recipientAdress = recipient || "0x0000000000000000000000000000000000000000";
            if (recipientAdress.length !== 42 || recipientAdress === selectedAccount) {
                alert('Dirección de destinatario inválida');
                return;
            }

            const result = await MyContract1.methods.mint(recipientAdress, parsedSalary, parsedStart, parsedDuration, description, title)
                .send({ from: selectedAccount, value: parsedSalary, gas: 1000000 });
            setMintStatus(`Contrato creado con el ID: ${result.events.Transfer.returnValues.tokenId}`);
        } catch (error) {
            console.error("Error al interactuar con el contrato:", error);
            setMintStatus("Error al crear el contrato");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setTitle}
                value={title}
                placeholder="Introduce el título del contrato"
                maxLength={50}
            />

            <TextInput
                style={styles.input}
                onChangeText={setRecipient}
                value={recipient}
                placeholder="Introduce la dirección del destinatario (OPCIONAL)"
                maxLength={42}
            />
            <TextInput
                style={styles.input}
                onChangeText={setSalary}
                value={salary}
                placeholder="Introduce el salario"
                keyboardType="numeric"
                maxLength={8}
            />
            <TextInput
                style={styles.input}
                onChangeText={setStart}
                value={start}
                placeholder="Introduce el comienzo del contrato"
                keyboardType="numeric"
                maxLength={8}
            />
            <TextInput
                style={styles.input}
                onChangeText={setDuration}
                value={duration}
                placeholder="Introduce la duración del contrato"
                keyboardType="numeric"
                maxLength={8}
            />
            <TextInput
                style={styles.input}
                onChangeText={setDescription}
                value={description}
                placeholder="Introduce la descripción"
                maxLength={1000}
            />
            <Boton
                texto="Crear Contrato"
                onPress={mintContract}
                estiloBoton={
                    {
                        borderRadius: 5,
                        marginTop: 10,
                        width: 200,
                    }
                }
            />
            <Text>{mintStatus}</Text>
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
        width: '80%',
        backgroundColor: "white",
    },
});

import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import Web3 from "web3";
import Boton from "../components/Boton.js";
import { useAccount } from "../components/ContextoCuenta.js";
import { MyContract, provider } from "../ContractConexion/EtherProvider";


export default function CreateContract() {
    const [_title, setTitle] = useState('');
    const [recipient, setRecipient] = useState('');
    const [salary, setSalary] = useState('');
    const [start, setStart] = useState('');
    const [duration, setDuration] = useState('');
    const [_description, setDescription] = useState('');
    const [mintStatus, setMintStatus] = useState('');
    const { selectedAccount } = useAccount();



    const mintContract = async () => {
        if (!salary || !start || !duration || !_description || !_title) {
            alert("Por favor, introduce todos los datos.");
            return;
        }

        try {
            if (!selectedAccount) {
                alert("Por favor, inicia sesión con tu billetera y selecciona una cuenta.");
            }


            const _parsedSalary = Web3.utils.toWei(salary, 'ether');
            const _start = Number(start);
            const _duration = Number(duration);
            const _to = recipient || "0x0000000000000000000000000000000000000000";
            if (!Web3.utils.isAddress(_to) || _to === selectedAccount) {
                alert("Dirección de destinatario inválida");
                return;
            }


            const result = await MyContract.methods.mint(_to, _parsedSalary, _start, _duration, _description, _title)
                .send({ from: selectedAccount, value: _parsedSalary, gas: 1000000 });

            console.log("Contrato creado:", result);
            alert(`Contrato "${_title}" creado. `);
        } catch (error) {
            console.error("Error al interactuar con el contrato:", error);
            alert("Error al crear el contrato");
            setMintStatus("Error al crear el contrato");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setTitle}
                value={_title}
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
                value={_description}
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
            <Text style={styles.textoAviso}>{mintStatus}</Text>
        </View >
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
    textoAviso: {
        fontSize: 17,
        color: "#586069",
        marginBottom: 20,
        marginTop: 20,
        fontStyle: "italic",
        textAlign: "center",
        paddingHorizontal: 10,
    },
});

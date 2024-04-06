import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, Button, Switch } from "react-native";
import Boton from "../components/Boton.js";
import { ethers } from 'ethers';
import { EtherProvider } from "../ContractConexion/EtherProvider";
import { useAccount, useContractWrite } from "wagmi";

const ModifyContract = ({ route, navigation }) => {
    const { contractDetails } = route.params;
    const [title, setTitle] = useState(contractDetails.title);
    const [salary, setSalary] = useState(contractDetails.salary);
    const [startDate, setStartDate] = useState(contractDetails.startDate);
    const [duration, setDuration] = useState(contractDetails.duration);
    const [endDate, setEndDate] = useState(contractDetails.endDate);
    const [description, setDescription] = useState(contractDetails.description);
    const [isPaused, setIsPaused] = useState(contractDetails.isPaused);
    const [tokenId, setTokenId] = useState(contractDetails.tokenId);
    const { address } = useAccount();
    const { contractAddress, ABI } = EtherProvider();

    const { writeAsync } = useContractWrite({
        address: contractAddress,
        abi: ABI,
        functionName: 'proposeChange',
    })

    console.log(duration);
    console.log(startDate);
    console.log(endDate);

    const sendProposal = async () => {
        try {
            if (!address) {
                alert("Por favor, inicia sesión con tu billetera y selecciona una cuenta.");
            } else {
                const parsedSalary = ethers.utils.parseEther(salary);
                const tx = await writeAsync({
                    args: [
                        tokenId,
                        title,
                        parsedSalary,
                        duration,
                        description,
                        isPaused,
                    ],
                    value: parsedSalary,
                });
                console.log(tx);

                navigation.navigate("ShowContract", { tokenId: tokenId });
            }
        } catch (error) {
            console.error("Error al modificar el contrato:", error);
            alert("Error al modificar el contrato.");
        }
    };

    const hasChanges = () => {
        return (
            title !== contractDetails.title ||
            salary !== contractDetails.salary ||
            duration !== contractDetails.duration ||
            description !== contractDetails.description ||
            isPaused !== contractDetails.isPaused
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>

                <Text style={styles.text}>Título</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    maxLength={35}
                />

                <Text style={styles.text}>Salario</Text>
                <TextInput
                    style={styles.input}
                    value={salary}
                    onChangeText={setSalary}
                    maxLength={8}
                    keyboardType="numeric"
                />

                <Text style={styles.text}>Descripción</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    maxLength={1000}
                />

                <Text style={styles.text}>Duración</Text>
                <TextInput
                    style={styles.input}
                    value={duration.toString()}
                    onChangeText={text => setDuration(text === '' ? '' : Number(text))}
                    maxLength={8}
                    keyboardType="numeric"
                />

                <View style={styles.switchContainer}>
                    <Text style={styles.switchText}>Pausar Contrato </Text>
                    <Switch
                        value={isPaused}
                        onValueChange={setIsPaused}
                    //trackColor={{ false: "#767577", true: "#164863" }}
                    />
                </View>

                <Boton
                    texto="Solicitar Cambios"
                    onPress={() => {
                        if (hasChanges()) {
                            sendProposal();
                        } else {
                            alert("Modifica el contrato antes de enviar la solicitud de cambios");
                        }
                    }}
                    estiloBoton={{
                        borderRadius: 5,
                        marginTop: 20,
                        width: "100%",
                    }}
                />
                <Text style={styles.textoAviso}> Solo si el trabajador acepta los cambios estos surgiran efecto  </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    innerContainer: {
        width: "80%",
        alignItems: 'stretch',
    },
    textoAviso: {
        fontSize: 16,
        color: "#586069",
        marginBottom: 10,
        marginTop: 10,
        fontStyle: "italic",
        textAlign: "center",
        paddingHorizontal: 10,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: "white",
    },
    text: {
        fontSize: 16,
        color: "black",
        marginBottom: -5,
        marginTop: 10,
        textAlign: "left",
        paddingHorizontal: 15,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 14,
        paddingHorizontal: 15,
    },
    switchText: {
        fontSize: 16,
        color: "black",
        alignSelf: "center",
        marginRight: 13,
    },
});

export default ModifyContract;
import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Switch, ScrollView } from "react-native";
import Boton from "../components/Boton.js";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAccount } from "../components/ContextoCuenta";
import { getMyContract, getWeb3 } from "../ContractConexion/EtherProvider";


const ModifyContract = ({ route, navigation }) => {

    const { selectedAccount } = useAccount();
    const { contractDetails } = route.params;
    const [title, setTitle] = useState(contractDetails.title);
    const [salary, setSalary] = useState(contractDetails.salary);
    const [description, setDescription] = useState(contractDetails.description);
    const [isPaused, setIsPaused] = useState(contractDetails.isPaused);

    const tokenId = contractDetails.tokenId;
    const startDateSeconds = contractDetails.startSeconds;
    const endDateSeconds = contractDetails.startSeconds + contractDetails.duration;
    const duration = contractDetails.duration;

    const [mode, setMode] = useState("date");
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(endDateSeconds * 1000));
    const [secondsToFinish, setSecondsToFinish] = useState(contractDetails.duration);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setSelectedDate(currentDate);
        const startDate = new Date(startDateSeconds * 1000);

        if (currentDate < startDate) {
            alert("La fecha de finalización no puede ser anterior a la fecha de inicio");
            return;
        }

        if (currentDate < new Date()) {
            alert("La fecha de finalización no puede ser anterior a la fecha actual");
            return;
        }

        const seconds = Math.floor((currentDate - startDate) / 1000);
        setSecondsToFinish(seconds);
    };

    const showDatepicker = () => {
        setShow(true);
        setMode("date");
    };

    const showTimepicker = () => {
        setShow(true);
        setMode("time");
    };

    const sendProposal = async () => {
        try {
            if (!selectedAccount) {
                alert("Por favor, inicia sesión con tu billetera y selecciona una cuenta.");
            } else {
                const web3 = await getWeb3();
                const MyContract = await getMyContract();

                const parsedSalary = web3.utils.toWei(salary, "ether");

                MyContract.methods.proposeChange(tokenId, title, parsedSalary, secondsToFinish, description, isPaused).send({ from: selectedAccount, value: parsedSalary, gas: 1000000 });
                console.log("tokenID", contractDetails.tokenId, "title", contractDetails.title, "salary", contractDetails.salary, "diration", contractDetails.duration, "description", contractDetails.description, "isPaused", contractDetails.isPaused);
                console.log("tokenID", tokenId, "title", title, "salary", parsedSalary, "secondsToFinish", secondsToFinish, "description", description, "isPaused", isPaused);
                alert("Solicitud de cambios enviada correctamente.");
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
            secondsToFinish !== endDateSeconds ||
            description !== contractDetails.description ||
            isPaused !== contractDetails.isPaused
        );
    };

    return (
        <ScrollView>
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
                        maxLength={15}
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
                    <View style={styles.containerDate}>
                        <TouchableOpacity style={styles.DateButton} onPress={showDatepicker} >
                            {selectedDate && (
                                <Text style={styles.dateInput}>{selectedDate.toLocaleDateString()}</Text>
                            )}
                            {!selectedDate && (
                                <Text style={styles.dateInputEmpty}>DD/MM/AAAA</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={showTimepicker} style={styles.DateButton}>
                            {selectedDate && (
                                <Text style={styles.dateInput}>{selectedDate.toLocaleTimeString()}</Text>
                            )}
                            {!selectedDate && (
                                <Text style={styles.dateInputEmpty}>HH:MM:SS</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={selectedDate}
                            mode={mode}
                            is24Hour={true}
                            onChange={onChange}
                            minimumDate={new Date()}
                        />
                    )}

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
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F2",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        marginTop: 47,
    },
    innerContainer: {
        width: "80%",
        alignSelf: "center",
        alignItems: "stretch",
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
        width: "90%",
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
        flexDirection: "row",
        alignItems: "center",
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

    containerDate: {
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "80%",
        paddingHorizontal: 10,
    },
    DateButton: {
        marginRight: 8,
        width: "52%",
    },
    dateInputEmpty: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        width: "100%",
        backgroundColor: "white",
        textAlign: "center",
        color: "gray",
    },
    dateInput: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        width: "100%",
        backgroundColor: "white",
        textAlign: "center",
    },
});

export default ModifyContract;


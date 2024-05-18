import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Boton from "../components/Boton.js";
import { useAccount } from "../components/ContextoCuenta.js";
import { getMyContract, getWeb3 } from "../ContractConexion/EtherProvider";
import { Picker } from "@react-native-picker/picker";
import { Country, City } from "country-state-city";



export default function CreateContract() {
    const [_title, setTitle] = useState('');
    const [recipient, setRecipient] = useState('');
    const [salary, setSalary] = useState('');
    const [_description, setDescription] = useState('');
    const [cities, setCities] = useState([]);
    const [mintStatus, setMintStatus] = useState('');
    const { selectedAccount } = useAccount();

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [mode, setMode] = useState('date');
    const [showStart, setShowStart] = useState(false);
    const [showEnd, setShowEnd] = useState(false);
    const [secondsToStart, setSecondsToStart] = useState(0);
    const [secondsToFinish, setSecondsToFinish] = useState(0);



    // Codigo para calendario y reloj
    const onChangeStart = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowStart(false);
        setStartDate(currentDate);

        const now = new Date();
        const seconds = Math.floor((currentDate - now) / 1000);
        setSecondsToStart(seconds);
    };

    const onChangeEnd = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShowEnd(false);
        setEndDate(currentDate);

        if (endDate < startDate) {
            alert("La fecha de finalización no puede ser anterior a la fecha de inicio");
            return;
        }

        const seconds = Math.floor((currentDate - startDate) / 1000);
        setSecondsToFinish(seconds);
    };

    const showMode = (currentMode, type) => {
        if (type === 'start') {
            setShowStart(true);
            setMode(currentMode);
        } else {
            setShowEnd(true);
            setMode(currentMode);
        }
    };


    const mintContract = async () => {
        if (!salary || !secondsToStart || !secondsToFinish || !_description || !_title) {
            alert("Por favor, introduce todos los datos.");
            return;
        }

        if (!selectedAccount) {
            alert("Por favor, inicia sesión con tu billetera y selecciona una cuenta");
            return;
        }

        try {
            const web3 = await getWeb3();
            const MyContract = await getMyContract();

            const now = new Date();
            if (startDate < now) {
                alert("La hora de inicio no puede ser anterior a la hora actual");
                return;
            }

            if (endDate < startDate) {
                alert("La fecha de finalización no puede ser anterior a la fecha de inicio");
                return;
            }

            const _parsedSalary = web3.utils.toWei(salary, 'ether');
            const _to = recipient || "0x0000000000000000000000000000000000000000";

            if (!web3.utils.isAddress(_to)) {
                alert("Dirección de destinatario inválida");
                return;
            }

            if (_to === selectedAccount) {
                alert("No puedes crear un contrato con tu propia dirección");
                return;
            }


            const result = await MyContract.methods.mint(_to, _parsedSalary, secondsToStart, secondsToFinish, _description, _title)
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
        <ScrollView>
            <View style={styles.container}>

                <Text style={styles.TextInput}>Título del contrato</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setTitle}
                    value={_title}
                    placeholder="Introduce el título del contrato"
                    maxLength={50}
                />

                <Text style={styles.TextInput}>Descripción del contrato</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setDescription}
                    value={_description}
                    placeholder="Introduce la descripción"
                    maxLength={1000}
                />

                <Text style={styles.TextInput}>Dirección del destinatario (opcional)</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setRecipient}
                    value={recipient}
                    placeholder="Introduce la dirección del destinatario"
                    maxLength={42}
                />

                <Text style={styles.TextInput}>Salario del trabajador</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setSalary}
                    value={salary}
                    placeholder="Introduce el salario"
                    keyboardType="numeric"
                    maxLength={15}
                />

                <Text style={styles.TextInput}>Fecha inicio</Text>
                <View style={styles.containerDate}>
                    <TouchableOpacity onPress={() => showMode("date", "start")} style={styles.DateButton}>
                        {startDate && (
                            <Text style={styles.dateInput}>{startDate.toLocaleDateString()}</Text>
                        )}
                        {!startDate && (
                            <Text style={styles.dateInputEmpty}>DD/MM/AAAA</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showMode("time", "start")} style={styles.DateButton}>
                        {startDate && (
                            <Text style={styles.dateInput}>{startDate.toLocaleTimeString()}</Text>
                        )}
                        {!startDate && (
                            <Text style={styles.dateInputEmpty}>HH:MM:SS</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.TextInput}>Fecha fin</Text>
                <View style={styles.containerDate}>
                    <TouchableOpacity onPress={() => showMode("date", "end")} style={styles.DateButton}>
                        {endDate && (
                            <Text style={styles.dateInput}>{endDate.toLocaleDateString()}</Text>
                        )}
                        {!endDate && (
                            <Text style={styles.dateInputEmpty}>DD/MM/AAAA</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => showMode("time", "end")} style={styles.DateButton}>
                        {endDate && (
                            <Text style={styles.dateInput}>{endDate.toLocaleTimeString()}</Text>
                        )}
                        {!endDate && (
                            <Text style={styles.dateInputEmpty}>HH:MM:SS</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {showStart && (
                    <DateTimePicker
                        testID="dateTimePickerStart"
                        value={startDate || new Date()}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChangeStart}
                        minimumDate={new Date()}
                    />
                )}
                {showEnd && (
                    <DateTimePicker
                        testID="dateTimePickerEnd"
                        value={endDate || new Date()}
                        mode={mode}
                        is24Hour={true}
                        onChange={onChangeEnd}
                        minimumDate={startDate}
                    />
                )}



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
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        padding: 20
    },
    input: {
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
        width: "90%",
        backgroundColor: "white",
    },
    TextInput: {
        fontSize: 17,
        textAlign: "left",
        width: "90%",
        marginBottom: -10,
        marginTop: 9,
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
    containerDate: {
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "90%",
    },
    DateButton: {
        marginRight: 8,
        width: "40%",
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
    picker: {
        backgroundColor: "white",
        borderColor: "red",
    },
});

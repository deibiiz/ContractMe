import React, { useState } from "react";
import { View, StyleSheet, Text, TextInput, Button, Switch } from "react-native";
import { web3, MyContract1 } from '../ether/web3.js';

const ModifyContract = ({ route, navigation }) => {
    const { contractDetails } = route.params;
    const [salary, setSalary] = useState(contractDetails.salary);
    const [duration, setDuration] = useState(contractDetails.duration);
    const [endDate, setEndDate] = useState(contractDetails.endDate);
    const [description, setDescription] = useState(contractDetails.description);
    const [isPaused, setIsPaused] = useState(contractDetails.isPaused);
    const [tokenId, setTokenId] = useState(contractDetails.tokenId);


    const sendProposal = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            let parsedSalary = web3.utils.toWei(salary, 'ether')
            console.log(tokenId, parsedSalary, duration, description, isPaused)
            MyContract1.methods.proposeChange(tokenId, parsedSalary, duration, description, isPaused).send({ from: accounts[0], value: parsedSalary, gas: 1000000 });
            navigation.navigate('ShowContract', { tokenId: tokenId });
        } catch (error) {
            console.error("Error al modificar el contrato:", error);
            alert('Error al modificar el contrato.');
        }
    };

    return (
        <View>
            <TextInput
                value={salary}
                onChangeText={setSalary}
                maxLength={8}
                keyboardType="numeric"
            />
            <TextInput
                value={description}
                onChangeText={setDescription}
                maxLength={1000}
            />
            <TextInput
                value={duration}
                onChangeText={setDuration}
                maxLength={8}
                keyboardType="numeric"
            />
            <View style={styles.switchContainer}>
                <Text style={styles.text}>Pausar Contrato </Text>
                <Switch
                    value={isPaused}
                    onValueChange={setIsPaused}
                    trackColor={{ false: "#767577", true: "#30CBC4" }}
                />
            </View>
            <Button
                title="Solicitar Cambios"
                onPress={sendProposal}
            />
            <Text style={styles.textoAviso}> Solo si el trabajador acepta los cambios estos surgiran efecto  </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
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
});

export default ModifyContract;
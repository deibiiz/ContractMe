import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { MyContract1 } from '../ether/web3.js';
import { useAccount } from '../components/ContextoCuenta.js';

const AssignManagerScreen = ({ route, navigation }) => {
    const { tokenId } = route.params;
    const [newManagerAddress, setNewManagerAddress] = useState('');
    const { selectedAccount } = useAccount();

    const assignManager = async () => {
        if (!newManagerAddress) {
            alert('Por favor, introduce una dirección válida.');
            return;
        }

        try {
            console.log("Asignando manager...", tokenId, newManagerAddress);
            const receipt = await MyContract1.methods.assignManagerToToken(tokenId, newManagerAddress).send({ from: selectedAccount, gas: 1000000 });
            console.log(receipt);
            alert('Manager asignado con éxito.');
            navigation.goBack();
        } catch (error) {
            console.error("Error al asignar manager:", error);
            alert('Error al asignar manager.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Asignar Nuevo Manager</Text>
            <TextInput
                style={styles.input}
                onChangeText={setNewManagerAddress}
                value={newManagerAddress}
                placeholder="Dirección del Manager"
            />
            <Button
                title="Asignar Manager"
                onPress={assignManager}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        marginVertical: 12,
        borderWidth: 1,
        padding: 10,
    },
});

export default AssignManagerScreen;

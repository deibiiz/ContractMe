import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { web3, MyContract1 } from '../ether/web3.js';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function Alertas() {

    const [pendingContracts, setPendingContracts] = useState([]);
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            fetchWorkerContracts();
        }, [])
    );


    const fetchWorkerContracts = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                const account = accounts[1];
                const contractsList = await MyContract1.methods.getContractsOfWorker(account).call();
                let pendingOwnerContracts = [];

                for (let contractId of contractsList) {
                    const proposal = await MyContract1.methods.changeProposals(contractId).call();
                    if (proposal.isPending) {
                        pendingOwnerContracts.push(contractId.toString());
                    }
                }
                setPendingContracts(pendingOwnerContracts);
            }
        } catch (error) {
            console.error("Error al obtener los contratos:", error);
        }
    };

    const selectContract = async (tokenId) => {
        const details = await fetchContractDetails(tokenId);
        if (details) {
            navigation.navigate('ApplyChanges', { contractDetails: details });
        } else {
            console.log("Detalles del contrato no disponibles.");
        }
    };

    const fetchContractDetails = async (tokenId) => {
        try {
            const details = await MyContract1.methods.contractDetails(tokenId).call();
            const proposal = await MyContract1.methods.changeProposals(tokenId).call();
            const employer = await MyContract1.methods.getOwnerOfContract(tokenId).call()

            const salaryInEther = web3.utils.fromWei(details.salary, 'ether');
            const newSalaryInEther = proposal.newSalary ? web3.utils.fromWei(proposal.newSalary, 'ether') : salaryInEther;

            const startDate = new Date(Number(details.startDate) * 1000).toLocaleString();
            const endDate = new Date((Number(details.startDate) + Number(details.duration)) * 1000).toLocaleString();
            const newEndDate = proposal.newDuration ? new Date((Number(details.startDate) + Number(proposal.newDuration)) * 1000).toLocaleString() : endDate;

            const newDescription = proposal.newDescription ? proposal.newDescription : details.description;
            const newIsPaused = proposal.isPaused ? proposal.isPaused : details.isPaused;

            const contractData = {
                ...details,
                tokenId: tokenId,
                startDate: startDate,
                endDate: endDate,
                newSalary: newSalaryInEther,
                newEndDate: newEndDate,
                newDescription: newDescription,
                newIsPaused: newIsPaused,
                employer: employer,
            };

            return contractData;

        } catch (error) {
            console.error("Error al obtener detalles del contrato:", error);
            return null;
        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                {pendingContracts.length > 0 && (
                    <Text style={styles.title}>Solicitud de modificación del contrato</Text>
                )}
                {pendingContracts.length == 0 && (
                    <Text style={styles.textoAviso}>No tienes ninguna notificación</Text>
                )}


                <FlatList
                    data={pendingContracts}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.contractItem}
                            onPress={() => { selectContract(item) }}
                        >
                            <Text>Contrato ID: {item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View >
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    contractItem: {
        padding: 14,
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
    },
    detailsContainer: {
        marginTop: 20,
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    textoAviso: {
        fontSize: 22,
        color: "#586069",
        marginBottom: 10,
        marginTop: 30,
        fontStyle: "italic",
        textAlign: "center",
        paddingHorizontal: 10,
    },
});

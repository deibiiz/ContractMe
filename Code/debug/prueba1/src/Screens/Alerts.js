import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import { EtherProvider } from "../ContractConexion/EtherProvider";
import { useAccount } from "wagmi";

export default function Alertas() {

    const [pendingContracts, setPendingContracts] = useState([]);
    const navigation = useNavigation();
    const { address } = useAccount();
    const { contract } = EtherProvider();

    useFocusEffect(
        useCallback(() => {
            fetchWorkerContracts();
        }, [address])
    );


    const fetchWorkerContracts = async () => {
        try {

            if (!address) {
                alert("Por favor, inicia sesión en MetaMask y selecciona una cuenta.");
            } else {

                if (address) {
                    const contractsList = await contract.getContractsOfWorker(address);
                    let pendingOwnerContracts = [];

                    for (let contractId of contractsList) {
                        const proposal = await contract.changeProposals(contractId);
                        if (proposal.isPending) {
                            pendingOwnerContracts.push(contractId.toString());
                        }
                    }
                    setPendingContracts(pendingOwnerContracts);
                }
            }
        } catch (error) {
            console.error("Error al obtener los contratos:", error);
        }

    };

    const selectContract = async (tokenId) => {
        const { oldDetails, newDetails } = await fetchContractDetails(tokenId);
        if (newDetails) {
            navigation.navigate("ApplyChanges", { oldContractDetails: oldDetails, newContractDetails: newDetails });
        } else {
            console.log("Detalles del contrato no disponibles.");
        }
    };

    const fetchContractDetails = async (tokenId) => {
        try {
            const details = await contract.contractDetails(tokenId);
            const proposal = await contract.changeProposals(tokenId);
            const employer = await contract.getOwnerOfContract(tokenId);

            const newTitle = proposal.newTitle ? proposal.newTitle : details.title;

            const salaryInEther = ethers.utils.formatEther(details.salary);
            const newSalaryInEther = proposal.newSalary ? ethers.utils.formatEther(proposal.newSalary) : salaryInEther;

            const startDate = new Date(Number(details.startDate) * 1000).toLocaleString();
            const endDate = new Date((Number(details.startDate) + Number(details.duration)) * 1000).toLocaleString();
            const newEndDate = proposal.newDuration ? new Date((Number(details.startDate) + Number(proposal.newDuration)) * 1000).toLocaleString() : endDate;

            const newDescription = proposal.newDescription ? proposal.newDescription : details.description;
            const newIsPaused = proposal.isPaused ? proposal.isPaused : details.isPaused;

            const oldContractData = {
                tokenId: tokenId,
                title: details.title,
                startDate: startDate,
                endDate: endDate,
                salary: salaryInEther,
                description: details.description,
                isPaused: details.isPaused,
                employer: employer,
                worker: details.worker,
            };

            const newContractData = {
                tokenId: tokenId,
                newTitle: newTitle,
                startDate: startDate,
                endDate: endDate,
                newSalary: newSalaryInEther,
                newEndDate: newEndDate,
                newDescription: newDescription,
                newIsPaused: newIsPaused,
                employer: employer,
                worker: details.worker,
            };

            return { oldDetails: oldContractData, newDetails: newContractData }

        } catch (error) {
            console.error("Error al obtener detalles del contrato:", error);
            return null;
        }
    };

    const renderHeader = () => (
        <View>
            {pendingContracts.length > 0 ? (
                <Text style={styles.title}>Solicitud de modificación del contrato</Text>
            ) : (
                <Text style={styles.textoAviso}>No tienes ninguna notificación</Text>
            )}
        </View>
    );

    return (

        <FlatList
            data={pendingContracts}
            keyExtractor={(item) => item}
            ListHeaderComponentStyle={renderHeader}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.contractItem}
                    onPress={() => { selectContract(item) }}
                >
                    <Text>Contrato ID: {item}</Text>
                </TouchableOpacity>
            )}
        />
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

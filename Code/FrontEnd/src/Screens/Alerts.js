import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ethers } from 'ethers';
import { EtherProvider } from "../ContractConexion/EtherProvider";
import { useAccount } from "wagmi";

export default function Alertas() {

    const [events, setEvents] = useState([]);
    const [pendingContracts, setPendingContracts] = useState([]);
    const navigation = useNavigation();
    const { address } = useAccount();
    const { contract } = EtherProvider();



    useFocusEffect(
        React.useCallback(() => {
            if (address) {
                getAccountHistory(address).then(events => {
                    setEvents(events);
                    fetchWorkerContracts();
                }).catch(error => {
                    console.error("Error al obtener el historial de la cuenta", error);
                    alert("Error al obtener el historial de la cuenta");
                });
            }
        }, [address])
    );

    const getAccountHistory = async (accoutAddress) => {

        let allEvents = [];

        const SalaryReleasedFilter = contract.filters.SalaryReleased(null, null, null, accoutAddress);
        const TokenMintedFilter = contract.filters.TokenMinted(null, accoutAddress);
        const ApprovalChangesFilter = contract.filters.ApprovalChanges(null, accoutAddress);
        const RejectChangesFilter = contract.filters.RejectChanges(null, accoutAddress);
        const SignerFilter = contract.filters.ContractSigned(null, accoutAddress);

        const SalaryReleasedEvents = await contract.queryFilter(SalaryReleasedFilter, 0, "latest");
        const TokenMintedEvents = await contract.queryFilter(TokenMintedFilter, 0, "latest");
        const ApprovalChangesEvents = await contract.queryFilter(ApprovalChangesFilter, 0, "latest");
        const RejectChangesEvents = await contract.queryFilter(RejectChangesFilter, 0, "latest");
        const SignerEvents = await contract.queryFilter(SignerFilter, 0, "latest");

        const addEvents = (events, type) => {
            events.forEach(event => {
                const eventData = {
                    type: type,
                    tokenId: event.args.tokenId.toString(),
                    date: new Date(event.args.timestamp * 1000),
                    dateString: new Date(event.args.timestamp * 1000).toLocaleString(),
                };
                allEvents.push(eventData);
            });
        };

        addEvents(SalaryReleasedEvents, "SalaryReleased");
        addEvents(TokenMintedEvents, "TokenMinted");
        addEvents(ApprovalChangesEvents, "ApprovalChanges");
        addEvents(RejectChangesEvents, "RejectChanges");
        addEvents(SignerEvents, "Signer");

        allEvents.sort((a, b) => a.date - b.date);
        allEvents.reverse();

        return allEvents;
    };

    const eventToText = (eventType) => {
        switch (eventType) {
            case "TokenMinted":
                return "Tienes una oferta de contrato";
            case "ApprovalChanges":
                return "Tu trabajador ha aceptado la modificación";
            case "RejectChanges":
                return "Tu trabajador ha rechazado la modificación";
            case "SalaryReleased":
                return "Tu salario ha sido liberado";
            case "Signer":
                return "Tu trabajador ha firma el contrato";
            case "ContractModification":
                return "Solicitud de modificación de contrato";
            default:
                return eventType;
        }
    };








    const fetchWorkerContracts = async () => {
        try {

            if (!address) {
                alert("Por favor, inicia sesión en MetaMask y selecciona una cuenta.");
            } else {
                const contractsList = await contract.getContractsOfWorker(address);
                let pendingOwnerContracts = [];

                for (let contractId of contractsList) {
                    const proposal = await contract.changeProposals(contractId);
                    if (proposal.isPending) {
                        pendingOwnerContracts.push({
                            type: "ContractModification",
                            tokenId: contractId.toString(),
                            date: new Date(), // Utiliza una fecha relevante
                            dateString: new Date().toLocaleString(), // O la fecha de la propuesta si está disponible
                        });
                    }
                }
                setEvents(prevEvents => [...prevEvents, ...pendingOwnerContracts]);
                console.log("Contratos pendientes de modificación:", pendingOwnerContracts);

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
            data={events}
            keyExtractor={(item, index) => item.tokenId.toString() + index}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.contractItem}
                    onPress={() => navigation.navigate("infoContract", { tokenId: item.tokenId })}
                >
                    <Text>{eventToText(item.type)} ID: {item.tokenId}</Text>
                    <Text>Date: {item.dateString}</Text>
                </TouchableOpacity>
            )}
            ListEmptyComponent={<Text style={styles.textoAviso}>No hay eventos registrados para esta cuenta.</Text>}
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

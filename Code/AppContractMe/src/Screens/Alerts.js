import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MyContract } from "../ContractConexion/EtherProvider";
import { useAccount } from "../components/ContextoCuenta";
import Web3 from "web3";

export default function Alertas() {

    const [events, setEvents] = useState([]);
    const [fetchStatus, setFetchStatus] = useState('');
    const navigation = useNavigation();
    const { selectedAccount } = useAccount();



    useFocusEffect(
        React.useCallback(() => {
            if (selectedAccount) {
                getAccountHistory(selectedAccount).then(events => {
                    setEvents(events);
                }).catch(error => {
                    console.error("Error al obtener el historial de la cuenta", error);
                    alert("Error al obtener el historial de la cuenta");
                });
            }
        }, [selectedAccount])
    );

    const getAccountHistory = async () => {
        setFetchStatus("Loading");
        try {
            const eventTypes = ["TokenMinted", "SalaryReleased", "ContractCancelled",
                "ContractFinalized", "ContractSigned", "ChangeProposed", "ApprovalChanges", "RejectChanges"];
            let allEvents = [];

            for (let eventType of eventTypes) {
                const fetchedEvents = await MyContract.getPastEvents(eventType, {
                    fromBlock: 0,
                    toBlock: "latest"
                });

                const processedEvents = fetchedEvents.map(event => {

                    return {
                        ...event,
                        eventName: eventType,
                        returnValues: {
                            ...event.returnValues,
                            tokenId: event.returnValues.tokenId.toString(),
                            date: new Date(parseInt(event.returnValues.timestamp.toString()) * 1000).toLocaleString(),
                        }
                    };
                }).filter(event => {
                    if (eventType === "SalaryReleased" || eventType === "ContractFinalized" || eventType === "ContractCancelled" || eventType === "ChangeProposed" || eventType === "TokenMinted") {
                        return event.returnValues.worker === selectedAccount;
                    } else {
                        return event.returnValues.employer === selectedAccount;
                    }
                });
                allEvents = [...allEvents, ...processedEvents];
            }

            allEvents.sort((a, b) => {

                return parseInt(b.returnValues.timestamp.toString()) - parseInt(a.returnValues.timestamp.toString());
            });
            return allEvents;
        } catch (error) {
            console.error("Error al obtener eventos:", error);
            setFetchStatus("Error al cargar los contratos");
        } finally {
            setFetchStatus('');
        }
    };


    const eventToText = (eventType) => {
        switch (eventType) {
            case "TokenMinted":
                return "Tienes una oferta de contrato";
            case "SalaryReleased":
                return "Tu salario ha sido liberado";
            case "ContractSigned":
                return "Se ha firma tu contrato";
            case "ContractCancelled":
                return "Se ha cancelado tu contrato";
            case "ContractFinalized":
                return "Se ha finalizado tu contrato";
            case "ChangeProposed":
                return "Solicitud de modificación";
            case "ApprovalChanges":
                return "Han aceptado tu modificación";
            case "RejectChanges":
                return "Han rechazado tu modificación";
            default:
                return eventType;
        }
    };


    return (
        <>
            {fetchStatus === "Loading" && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#164863" />
                </View>
            )}

            <FlatList
                data={events}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    if (item.eventName === "ContractCancelled") {
                        return (
                            <TouchableOpacity
                                style={styles.contractItem}
                            >
                                <Text style={styles.textItems}>{eventToText(item.eventName)}</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={styles.textoFecha}>Token ID:{item.returnValues.tokenId}</Text>
                                    <Text style={styles.textoFecha}>{item.returnValues.date}</Text>
                                </View>
                            </TouchableOpacity >
                        );
                    } else if (item.eventName === "ChangeProposed") {
                        return (
                            <TouchableOpacity
                                style={styles.contractItem}
                                onPress={() => navigation.navigate("infoContract", { tokenId: item.returnValues.tokenId, fromWorkerSection: true })}
                            >
                                <Text style={styles.textItems}>{eventToText(item.eventName)}</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={styles.textoFecha}>Token ID:{item.returnValues.tokenId}</Text>
                                    <Text style={styles.textoFecha}>{item.returnValues.date}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    } else {
                        return (
                            <TouchableOpacity
                                style={styles.contractItem}
                                onPress={() => navigation.navigate("infoContract", { tokenId: item.returnValues.tokenId })}
                            >
                                <Text style={styles.textItems}>{eventToText(item.eventName)}</Text>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    <Text style={styles.textoFecha}>Token ID:{item.returnValues.tokenId}</Text>
                                    <Text style={styles.textoFecha}>{item.returnValues.date}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }
                }
                }
                ListEmptyComponent={< Text style={styles.textoAviso} > No hay eventos registrados para esta cuenta.</Text >}
            />
        </>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    contractItem: {
        padding: 14,
        borderBottomWidth: 2,
        borderBottomColor: "#ccc",
    },
    detailsContainer: {
        marginTop: 20,
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    scrollView: {
        flex: 1,
        width: "100%",
    },
    textoAviso: {
        fontSize: 15,
        color: "#586069",
        marginBottom: 10,
        marginTop: 30,
        fontStyle: "italic",
        textAlign: "center",
        paddingHorizontal: 10,
    },
    textoFecha: {
        fontSize: 14,
        color: "#586069",
        textAlign: "right",
    },
    textItems: {
        fontSize: 16,
        color: "black",
        marginBottom: 8,
        marginTop: 5,
    },
    loadingContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
        opacity: 0.1,
    },
});


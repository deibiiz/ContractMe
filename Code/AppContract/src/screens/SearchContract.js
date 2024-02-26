import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { MyContract1 } from "../ether/web3.js";
import { useAccount } from "../components/ContextoCuenta";
import { useNavigation } from "@react-navigation/native";
import web3 from 'web3';

export default function SearchContracts() {

    const { selectedAccount } = useAccount();
    const [unsignedContracts, setUnsignedContracts] = useState([]);
    const navigation = useNavigation();

    const fetchUnsignedContracts = async () => {

        try {
            const contractIds = await MyContract1.methods.getUnsignedContractsOfWorker("0x0000000000000000000000000000000000000000").call();
            const contractActive = contractIds.map(async (id) => {
                const isFinished = await MyContract1.methods.isContractFinished(id).call();
                if (!isFinished) {
                    const details = await MyContract1.methods.contractDetails(id).call();
                    const title = details.title;
                    const salaryInEther = web3.utils.fromWei(details.salary, 'ether');
                    const startDate = new Date(Number(details.startDate) * 1000).toLocaleDateString();
                    const endDate = new Date(Number(details.startDate) * 1000 + Number(details.duration) * 1000).toLocaleDateString();
                    return { id, title, salaryInEther, startDate, endDate };
                }
                return null;
            });

            const contracts = await Promise.all(contractActive);
            const filteredContracts = contracts.filter(contract => contract !== null);
            setUnsignedContracts(filteredContracts);
        } catch (error) {
            console.error("Error al obtener contratos sin firmar:", error);
        }

    };
    useFocusEffect(
        useCallback(() => {
            fetchUnsignedContracts();
        }, [])
    );


    return (
        <View style={styles.fullContainer}>
            {
                unsignedContracts.length === 0 && <Text style={styles.textoAviso} >No hay contratos pendientes de firma.</Text>
            }

            <FlatList
                data={unsignedContracts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            style={styles.contractItem}
                            onPress={() => navigation.navigate('infoContract', { tokenId: item.id, fromWorkerSection: true })}
                        >
                            <Text style={styles.title}> {item.title}</Text>
                            <Text style={styles.textoInfo}> Salario: {item.salaryInEther} ETH</Text>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                                <Text style={styles.textoInfo}> {item.startDate}  -  </Text>
                                <Text style={styles.textoInfo}> {item.endDate}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}


const styles = StyleSheet.create({

    fullContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'stretch',
    },
    contractItem: {
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#ccc',
        width: '85%',
        alignSelf: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
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
    textoInfo: {
        fontSize: 14,
        color: "black",
    },
});



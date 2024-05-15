
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { getWeb3, getMyContract } from "../ContractConexion/EtherProvider";
import { useNavigation } from "@react-navigation/native";

export default function SearchContracts() {
    const [unsignedContracts, setUnsignedContracts] = useState([]);
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {

                try {
                    const web3 = await getWeb3();
                    const MyContract = await getMyContract();
                    const contractIds = await MyContract.methods.getUnsignedContractsOfWorker("0x0000000000000000000000000000000000000000").call();
                    const contractPromises = contractIds.map(async (id) => {
                        const isFinished = await MyContract.methods.isContractFinished(id).call();
                        if (!isFinished) {
                            const details = await MyContract.methods.contractDetails(id).call();
                            const title = details.title;
                            const salaryInEther = details.salary ? web3.utils.fromWei(details.salary, "ether") : "0";
                            const startDate = new Date(Number(details.startDate) * 1000).toLocaleDateString();
                            const endDate = new Date(Number(details.startDate) * 1000 + Number(details.duration) * 1000).toLocaleDateString();
                            return { id, title, salaryInEther, startDate, endDate };
                        }
                        return null;
                    });

                    const contracts = await Promise.all(contractPromises);
                    const filteredContracts = contracts.filter(contract => contract !== null);
                    setUnsignedContracts(filteredContracts);
                } catch (error) {
                    console.error("Error al obtener contratos sin firmar:", error);
                }
            };

            fetchData();
        }, [])
    );


    return (
        <View style={styles.fullContainer}>
            {
                unsignedContracts.length === 0 && <Text style={styles.textoAviso} >En estos momentos no hay contratos disponibles.</Text>
            }

            <FlatList
                data={unsignedContracts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            style={styles.contractItem}
                            onPress={() => navigation.navigate("infoContract", { tokenId: item.id.toString(), fromWorkerSection: true })}
                        >
                            <Text style={styles.textItems}> {item.title}</Text>
                            <Text style={styles.textoInfo}> Salario: {item.salaryInEther} ETH</Text>
                            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                                <Text style={styles.textoFecha}> {item.startDate} - </Text>
                                <Text style={styles.textoFecha}> {item.endDate}</Text>
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
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        alignItems: "stretch",
    },
    contractItem: {
        padding: 5,
        marginTop: 4,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        width: "100%",
        backgroundColor: "white",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    textoAviso: {
        fontSize: 16,
        color: "#586069",
        marginBottom: 20,
        marginTop: 20,
        fontStyle: "italic",
        textAlign: "center",
    },
    textoInfo: {
        fontSize: 16,
        color: "black",
        marginTop: 5,
        marginLeft: 8,
    },
    textoFecha: {
        fontSize: 14,
        color: "#586069",
        marginRight: 5,
    },
    textItems: {
        fontSize: 19,
        color: "black",
        marginLeft: 8,
    },
});





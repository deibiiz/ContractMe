import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAccount, useContractWrite } from "wagmi";
import { EtherProvider } from "../ContractConexion/EtherProvider";


export default function SignContract() {
    const [unsignedContracts, setUnsignedContracts] = useState([]);
    const { address } = useAccount();

    const navigation = useNavigation();

    if (!address) {
        alert('Por favor, inicia sesión con tu billetera y selecciona una cuenta.');
    }

    const fetchUnsignedContracts = async () => {
        const { contract } = EtherProvider();
        if (address) {
            try {
                const contractIds = await contract.getUnsignedContractsOfWorker(address);
                const contractActive = contractIds.map(async (id) => {
                    const isFinished = await contract.isContractFinished(id);
                    return isFinished ? null : id.toString();
                });

                const contracts = await Promise.all(contractActive);
                const filteredContracts = contracts.filter(contract => contract !== null);
                setUnsignedContracts(filteredContracts);
            } catch (error) {
                console.error("Error al obtener contratos sin firmar:", error);
            }
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUnsignedContracts();
        }, [address])
    );

    return (
        <View style={styles.fullContainer}>
            <TouchableOpacity
                onPress={() => navigation.navigate("QR")}
            >
                <Text style={styles.textoLink}>Escanear código QR</Text>
            </TouchableOpacity>


            <Text style={styles.title}>Contratos pendintes de firma</Text>
            {
                unsignedContracts.length === 0 && <Text style={styles.textoAviso} >No hay contratos pendientes de firma.</Text>
            }

            <FlatList
                data={unsignedContracts}
                keyExtractor={item => item.toString()}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            style={styles.contractItem}
                            onPress={() => navigation.navigate("infoContract", { tokenId: item, fromWorkerSection: true })}
                        >
                            <Text>Contrato ID: {item}</Text>
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
        alignItems: 'stretch',
        justifyContent: 'center',
        width: '100%',
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
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 17,
        marginTop: 10,
        alignSelf: 'center',

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
    buttonTouchable: {
        padding: 16,
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    textoLink: {
        fontSize: 16,
        color: "#164863",
        textAlign: "right",
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
        marginRight: 15,
        fontStyle: "italic",
        textDecorationLine: "underline",
    }
});

import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, FlatList } from 'react-native';
import Boton from '../components/Boton.js';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { EtherProvider } from "../ContractConexion/EtherProvider";
import { useAccount, useContractWrite } from "wagmi";

const AssignManagerScreen = ({ route }) => {
    const { tokenId } = route.params;
    const navigation = useNavigation();
    const [newManagerAddress, setNewManagerAddress] = useState('');
    const [managers, setManagers] = useState([]);
    const { address } = useAccount();
    const { contract, contractAddress, ABI } = EtherProvider();

    const { writeAsync } = useContractWrite({
        address: contractAddress,
        abi: ABI,
    })

    useEffect(() => {
        const getManagers = async () => {
            try {
                const managers = await contract.getManagersOfToken(tokenId);
                setManagers(managers);
            } catch (error) {
                console.error("Error al obtener managers:", error);
                alert("Error al obtener managers.");
            }
        }
        getManagers();
    }, [tokenId]);

    const assignManager = async () => {
        if (!newManagerAddress) {
            alert("Por favor, introduce una dirección válida.");
            return;
        }

        try {
            if (!address) {
                alert("Por favor, conecta tu wallet.");
            } else {
                console.log("Asignando manager...", tokenId, newManagerAddress);

                const tx = await writeAsync({
                    functionName: 'assignManagerToToken',
                    args: [
                        tokenId,
                        newManagerAddress,
                    ],
                });
                console.log(tx);

                alert("Manager asignado con éxito.");
                const updatedManagers = await contract.getManagersOfToken(tokenId);
                setManagers(updatedManagers);
                setNewManagerAddress("");
                navigation.navigate("Home1");
            }
        } catch (error) {
            console.error("Error al asignar manager:", error);
            alert("Error al asignar manager.");
        }
    };

    const removeManager = async (managerAddress) => {
        try {
            if (!address) {
                alert("Por favor, conecta tu wallet.");
            } else {
                console.log(address);
                const tx = await writeAsync({
                    functionName: 'revokeManagerFromToken',
                    args: [
                        tokenId,
                        managerAddress,
                    ],
                });
                console.log(tx);

                alert("Manager eliminado con éxito.");
                const updatedManagers = await contract.getManagersOfToken(tokenId);
                setManagers(updatedManagers);
            }
        }
        catch (error) {
            console.error("Error al eliminar manager:", error);
            alert("Error al eliminar manager.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Asignar Nuevo Manager</Text>
            <TextInput
                style={styles.input}
                onChangeText={setNewManagerAddress}
                value={newManagerAddress}
                placeholder="Dirección del Manager"
            />
            <Boton
                texto="Asignar Manager"
                onPress={assignManager}
                estiloBoton={{
                    borderRadius: 5,
                    marginTop: 10,
                    width: "80%",
                }
                }
            />

            <Text style={styles.subTitle}>Lista de Managers:</Text>
            <FlatList
                data={managers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => {
                    return (
                        <View style={styles.contractItem}>
                            <Text style={{ marginRight: 10 }}>{item}</Text>
                            <MaterialIcons
                                name="delete"
                                size={24}
                                color="#164863"
                                onPress={() => removeManager(item)}
                            />
                        </View>
                    );
                }}
                ListEmptyComponent={<Text>No hay managers asignados.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 30,
    },
    input: {
        height: 40,
        marginTop: 12,
        marginBottom: 6,
        borderWidth: 1,
        padding: 10,
        width: "95%",
        backgroundColor: "white",
    },
    subTitle: {
        fontSize: 23,
        marginTop: 50,
    },
    contractItem: {
        padding: 10,
        marginTop: 10,
        borderRadius: 5,
        borderBottomWidth: 2,
        borderBottomColor: "#ccc",
        width: "100%",
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: 'wrap', // Permite que los elementos se ajusten en líneas múltiples.
        justifyContent: 'space-between',
    },

});

export default AssignManagerScreen;

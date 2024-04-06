import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Boton from '../components/Boton.js';
import { EtherProvider } from "../ContractConexion/EtherProvider";
import { useAccount, useContractWrite } from "wagmi";

const ContractAlertScreen = ({ route }) => {
    const { oldContractDetails, newContractDetails } = route.params;
    const navigation = useNavigation();
    const { address } = useAccount();
    const { contractAddress, ABI } = EtherProvider();

    const { writeAsync } = useContractWrite({
        address: contractAddress,
        abi: ABI,
    })

    const rejectChanges = async () => {
        try {
            if (!address) {
                alert("Por favor, inicia sesión con tu billetera y selecciona una cuenta.");
            } else {
                const tx = await writeAsync({
                    functionName: 'rejectChange',
                    args: [
                        newContractDetails.tokenId,
                    ],
                });
                console.log(tx);

                navigation.navigate("Home1");
            }
        } catch (error) {
            console.error("Error al rechazar los cambios:", error);
            alert("Error al rechazar los cambios.");
        }
    };

    const acceptChanges = async () => {
        try {
            if (!address) {
                alert("Por favor, inicia sesión en MetaMask y selecciona una cuenta.");
            } else {
                const tx = await writeAsync({
                    functionName: 'applyChange',
                    args: [
                        newContractDetails.tokenId,
                    ],
                });
                console.log(tx);

                navigation.navigate("Home1");
            }
        } catch (error) {
            console.error("Error al aceptar los cambios:", error);
            alert("Error al aceptar los cambios.");
        }
    }

    console.log(oldContractDetails);
    console.log(newContractDetails);

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.titlePrincipal}>Nuevos términos del contrato</Text>

                <View style={styles.block}>
                    <Text style={styles.title}>Título del contrato</Text>
                    <Text>
                        {newContractDetails.newTitle != oldContractDetails.title ? (
                            <>
                                <Text style={{ fontWeight: "bold", color: "green" }}>{newContractDetails.newTitle}</Text>
                                <Text style={{ fontStyle: "italic", color: "gray" }}>    (antes: {oldContractDetails.title})</Text>
                            </>
                        ) : (
                            newContractDetails.newTitle
                        )}
                    </Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Cuenta del empleador</Text>
                    <Text>{newContractDetails.employer}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Cuenta del trabajador</Text>
                    <Text>{newContractDetails.worker}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Salario</Text>
                    <Text>
                        {newContractDetails.newSalary != oldContractDetails.salary ? (
                            <>
                                <Text style={{ fontWeight: "bold", color: "green" }}>{newContractDetails.newSalary} ETH</Text>
                                <Text style={{ fontStyle: "italic", color: "gray" }}>    (antes: {oldContractDetails.salary} ETH)</Text>
                            </>
                        ) : (
                            newContractDetails.newSalary + " ETH"
                        )}
                    </Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Descripción</Text>
                    <Text>
                        {newContractDetails.newDescription != oldContractDetails.description ? (
                            <View>
                                <Text style={{ fontWeight: "bold", color: "green" }}>{newContractDetails.newDescription}</Text>
                                <Text style={{ fontStyle: "italic", color: "gray" }}>(antes: {oldContractDetails.description})</Text>
                            </View>
                        ) : (
                            newContractDetails.newDescription
                        )}
                    </Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Fechas del Contrato</Text>
                    <Text>Inicio: {newContractDetails.startDate}</Text>
                    <Text>
                        Fin: {newContractDetails.newEndDate != oldContractDetails.endDate ? (
                            <>
                                <Text style={{ fontWeight: "bold", color: "green" }}>{newContractDetails.newEndDate}</Text>
                                <Text style={{ fontStyle: "italic", color: "gray" }}>    (antes: {oldContractDetails.endDate})</Text>
                            </>
                        ) : (
                            newContractDetails.newEndDate
                        )}
                    </Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Estado del Contrato</Text>
                    <Text>
                        {newContractDetails.newIsPaused != oldContractDetails.isPaused ? (
                            <>
                                <Text style={{ fontWeight: "bold", color: "green" }}>{newContractDetails.newIsPaused ? "Pausado" : "Activo"}</Text>
                                <Text style={{ fontStyle: "italic", color: "gray" }}>    (antes: {oldContractDetails.isPaused ? "Pausado" : "Activo"})</Text>
                            </>
                        ) : (
                            newContractDetails.newIsPaused ? "Pausado" : "Activo"
                        )}
                    </Text>
                </View>
                <View style={{ width: "85%", marginTop: 15, alignSelf: "center" }}>
                    <>
                        <Boton
                            texto="Aceptar cambios"
                            onPress={() => { acceptChanges() }}
                            estiloBoton={{
                                width: "100%",
                                borderRadius: 8,
                                marginBottom: 5,
                            }}
                            estiloTexto={{
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                        />
                        <Boton
                            texto="Rechazar cambios"
                            onPress={() => { rejectChanges() }}
                            estiloBoton={{
                                width: "100%",
                                borderRadius: 8,
                                backgroundColor: "#F84343",
                            }}
                            estiloTexto={{
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                        />
                    </>
                </View>
            </View>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 27,
        marginBottom: 27,
    },
    block: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 10,
        width: "85%",
    },
    titlePrincipal: {
        fontSize: 25,
        fontWeight: "bold",
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    scrollView: {
        flex: 1,
        width: "100%",
    },

});

export default ContractAlertScreen;

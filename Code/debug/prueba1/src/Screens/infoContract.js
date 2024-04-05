import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { EtherProvider } from "../ContractConexion/EtherProvider";
import { useAccount, useContractWrite } from "wagmi";
import { ethers } from "ethers";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Boton from '../components/Boton.js';


const ContractDetailsScreen = ({ route }) => {
    const { tokenId, fromWorkerSection } = route.params;
    console.log(tokenId, fromWorkerSection);
    const [contractDetails, setContractDetails] = useState(null);
    const navigation = useNavigation();
    const { address } = useAccount();
    const { contract, contractAddress, ABI } = EtherProvider();

    const { writeAsync } = useContractWrite({
        address: contractAddress,
        abi: ABI,
        functionName: 'signContract',
    })

    const fetchContractDetailsCallback = React.useCallback(() => {
        const fetchContractDetails = async () => {
            const details = await contract.contractDetails(tokenId);
            const employer = await contract.getOwnerOfContract(tokenId);
            const changeProposoal = await contract.changeProposals(tokenId);
            const salaryInEther = ethers.utils.formatEther(details.salary);
            const startDate = new Date(Number(details.startDate) * 1000).toLocaleString();
            const endDate = new Date(Number(details.startDate) * 1000 + Number(details.duration) * 1000).toLocaleString();
            const pauseTime = new Date(Number(details.pauseTime) * 1000).toLocaleString();
            const isFinished = await contract.isContractFinished(tokenId);

            setContractDetails({
                ...details,
                salary: salaryInEther,
                startDate: startDate,
                endDate: endDate,
                duration: Number(details.duration),
                pauseDate: pauseTime,
                pauseDuration: details.pauseDuration,
                isFinished: isFinished,
                salaryReleased: details.isReleased,
                description: details.description,
                tokenId: tokenId,
                isPending: changeProposoal.isPending,
                employer: employer,
                isSigned: details.isSigned,
            });
        };

        fetchContractDetails();
    }, [tokenId]);
    useFocusEffect(fetchContractDetailsCallback);

    const finalizeContract = async () => {
        try {
            if (!address) {
                alert('Por favor, inicia sesión con tu billetera y selecciona una cuenta.');
                return;
            }

            contract.finalizeContract(tokenId).send({ from: address });

            alert('Contrato finalizado con éxito.');
            setContractDetails(prevState => ({
                ...prevState,
                isFinished: true
            }));
        } catch (error) {
            console.error("Error al finalizar el contrato:", error);
            alert('Error al finalizar el contrato.');
        }
    };

    const cancelarContrato = async (contractId) => {
        try {
            if (!address) {
                alert('Por favor, inicia sesión con tu billetera y selecciona una cuenta.');
                return;
            }

            console.log(contractId);
            console.log(tokenId)
            await contract.cancelContract(contractId).send({ from: address });
            alert('Contrato cancelado con éxito.');

            navigation.navigate('ShowContract');
        } catch (error) {
            console.error("Error al cancelar el contrato:", error);
            alert("Error al cancelar el contrato.");
        }
    };

    const signTheContract = async () => {
        if (!tokenId) {
            alert('Falta ID del contrato.');
            return;
        }

        try {
            if (!address) {
                alert('Por favor, inicia sesión con tu billetera y selecciona una cuenta.');
                return;
            }

            const tx = await writeAsync({
                args: [
                    tokenId,
                ],
            });

            console.log(tx);

            alert('Contrato firmado con éxito.');
            setContractDetails(prevState => ({
                ...prevState,
                isSigned: true
            }));

            fetchContractDetailsCallback();
        } catch (error) {
            console.error("Error al firmar el contrato:", error);
            setSignStatus("Error al firmar el contrato");
        }
    };

    const releaseSalary = async () => {
        try {
            if (!address) {
                alert('Por favor, inicia sesión con tu billetera y selecciona una cuenta.');
                return;
            }

            contract.releaseSalary(tokenId).send({ from: address });
            alert('Salario liberado con éxito.');
            setContractDetails(prevState => ({
                ...prevState,
                salaryReleased: true
            }));
        } catch (error) {
            console.error("Error al liberar el salario:", error);
            alert('Error al liberar el salario.');
        }
    };


    if (!contractDetails) {
        return <Text>Cargando...</Text>;
    }

    const getContractState = () => {
        if (contractDetails.isFinished) {
            return 'Finalizado';
        } else if (contractDetails.isPaused) {
            return 'Pausado';
        } else if (!contractDetails.isSigned) {
            return 'Pendiente de aprobación';
        } else if (contractDetails.isPending) {
            return 'Modificación pendiente de aprobación';
        } else {
            return 'Activo';
        }
    };



    return (
        <ScrollView style={styles.ScrollView} >
            <View style={styles.container}>
                {address === contractDetails.employer && !contractDetails.isFinished && (
                    <>
                        <View style={{ width: "85%" }}>
                            <TouchableOpacity onPress={() => navigation.navigate('AddManager', { tokenId: tokenId })}>
                                <Text style={styles.textoLink}> Gestionar permisos de acceso al contrato </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
                <View style={styles.block}>
                    <Text style={styles.title}>Título del contrato</Text>
                    <Text>{contractDetails.title}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Cuenta del empleador</Text>
                    <Text>{contractDetails.employer}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Cuenta del trabajador</Text>
                    <Text>{contractDetails.worker}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Salario del trabajador</Text>
                    <Text> {contractDetails.salary} Ether</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Descripción del contrato</Text>
                    <Text> {contractDetails.description}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Fechas del contrato</Text>
                    <Text>Inicio:  {contractDetails.startDate}</Text>
                    <Text>Fin:      {contractDetails.endDate}</Text>
                </View>

                <View style={styles.block}>
                    <Text style={styles.title}>Estado</Text>
                    <Text>{getContractState()}</Text>
                    {contractDetails.isPaused && !contractDetails.isFinished && (
                        <Text>Fecha de pausa: {contractDetails.pauseDate}</Text>
                    )}
                </View>
                <View style={{ width: '85%', marginTop: 15, alignSelf: 'center' }}>
                    {!fromWorkerSection && (
                        <>
                            {!contractDetails.isFinished && contractDetails.isSigned && (
                                <>
                                    {!contractDetails.isPending && (
                                        <Boton
                                            texto="Modificar contrato"
                                            onPress={() => { navigation.navigate('ModifyContract', { contractDetails: contractDetails }) }}
                                            estiloBoton={{
                                                borderRadius: 8,
                                                width: "100%",
                                                marginBottom: 5,
                                            }}
                                            estiloTexto={{
                                                fontSize: 16,
                                                fontWeight: "bold",
                                            }}
                                        />
                                    )}
                                    <Boton
                                        texto="Finalizar contrato"
                                        onPress={() => { finalizeContract() }}
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

                                    {contractDetails.isPending && (
                                        <Text style={styles.textoAviso}>Modificación del contrato pendiente de aprobación</Text>
                                    )}
                                </>
                            )}


                            {contractDetails.isFinished && !contractDetails.salaryReleased && contractDetails.isSigned && (
                                <>
                                    <Boton
                                        texto="Liberar pago"
                                        onPress={() => { releaseSalary() }}
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
                                        texto="Abrir disputa"
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
                                    <Text style={styles.textoAviso}> Si no se abre una disputa, el pago será liberado automáticamente en 7 días.</Text>
                                </>
                            )}

                            {contractDetails.salaryReleased && (
                                <Text style={styles.textoAviso}> El salario ha sido liberado </Text>
                            )}

                            {!contractDetails.isSigned && (
                                <>
                                    <Boton
                                        texto="Mostrar código QR"
                                        onPress={() => { navigation.navigate('ShowQR', { tokenId: tokenId, worker: contractDetails.worker }) }}
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
                                        texto="Cancelar contrato"
                                        onPress={() => { cancelarContrato(contractDetails.tokenId) }}
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
                            )}

                        </>
                    )}

                    {!contractDetails.isSigned && fromWorkerSection && contractDetails.employer !== address && (
                        <Boton
                            texto="Firmar contrato"
                            onPress={() => { signTheContract(contractDetails.tokenId) }}
                            estiloBoton={{
                                width: "100%",
                                borderRadius: 8,
                            }}
                            estiloTexto={{
                                fontSize: 16,
                                fontWeight: "bold",
                            }}
                        />
                    )}
                </View>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 27,
        marginBottom: 27,
    },
    block: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 10,
        width: '85%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scrollView: {
        flex: 1,
        width: '100%',
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
    textoLink: {
        fontSize: 16,
        color: "#164863",
        textAlign: "right",
        fontWeight: "bold",
        marginBottom: 7,
        fontStyle: "italic",
        textDecorationLine: "underline",
    }

});

export default ContractDetailsScreen;
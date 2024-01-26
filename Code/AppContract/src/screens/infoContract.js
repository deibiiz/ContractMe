import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { web3, MyContract1 } from '../ether/web3.js';
import { useNavigation } from '@react-navigation/native';
import Boton from '../components/Boton.js';

const ContractDetailsScreen = ({ route }) => {
    const { tokenId, fromWorkerSection } = route.params;
    const [contractDetails, setContractDetails] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchContractDetails = async () => {
            const details = await MyContract1.methods.contractDetails(tokenId).call();
            const employer = await MyContract1.methods.getOwnerOfContract(tokenId).call();
            const changeProposoal = await MyContract1.methods.changeProposals(tokenId).call();
            const salaryInEther = web3.utils.fromWei(details.salary, 'ether');
            const startDate = new Date(Number(details.startDate) * 1000).toLocaleString();
            const endDate = new Date(Number(details.startDate) * 1000 + Number(details.duration) * 1000).toLocaleString();
            const pauseTime = new Date(Number(details.pauseTime) * 1000).toLocaleString();
            const isFinished = await MyContract1.methods.isContractFinished(tokenId).call();

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

    const finalizeContract = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            MyContract1.methods.finalizeContract(tokenId).send({ from: accounts[0] });
            navigation.navigate('ShowContract');
        } catch (error) {
            console.error("Error al finalizar el contrato:", error);
            alert('Error al finalizar el contrato.');
        }
    };

    const cancelarContrato = async (contractId) => {
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                alert("No se encontraron cuentas.");
                return;
            }
            await MyContract1.methods.cancelContract(contractId).send({ from: accounts[0] });
            navigation.navigate('ShowContract');
        } catch (error) {
            console.error("Error al cancelar el contrato:", error);
            alert("Error al cancelar el contrato.");
        }
    };

    const releaseSalary = async () => {
        try {
            const accounts = await web3.eth.getAccounts();
            MyContract1.methods.releaseSalary(tokenId).send({ from: accounts[0] });
            navigation.navigate('ShowContract');
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
        } else {
            return 'Activo';
        }
    };



    return (
        <ScrollView style={styles.ScrollView} >
            <View style={styles.container}>

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
                    {contractDetails.isPaused && !contractDetails.isFinished && (
                        <Text>Pausa: {contractDetails.pauseTime}</Text>
                    )}
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
                            )}
                        </>
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

});

export default ContractDetailsScreen;
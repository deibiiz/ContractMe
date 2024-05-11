import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAccount } from "../components/ContextoCuenta";
import { getMyContract, getWeb3 } from "../ContractConexion/EtherProvider";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Boton from '../components/Boton.js';


const ContractDetailsScreen = ({ route }) => {
    const { tokenId, fromWorkerSection } = route.params;
    console.log(tokenId, fromWorkerSection);
    const [contractDetails, setContractDetails] = useState(null);
    const navigation = useNavigation();
    const { selectedAccount } = useAccount();


    const fetchContractDetailsCallback = React.useCallback(() => {
        const fetchContractDetails = async () => {
            const MyContract = await getMyContract();
            const web3 = await getWeb3();

            const details = await MyContract.methods.contractDetails(tokenId).call();
            const employer = await MyContract.methods.getOwnerOfContract(tokenId).call();
            const changeProposoal = await MyContract.methods.changeProposals(tokenId).call();
            const salaryInEther = web3.utils.fromWei(details.salary, 'ether');
            const startDate = new Date(Number(details.startDate) * 1000).toLocaleString();
            const endDate = new Date(Number(details.startDate) * 1000 + Number(details.duration) * 1000).toLocaleString();
            const pauseTime = new Date(Number(details.pauseTime) * 1000).toLocaleString();
            const isFinished = await MyContract.methods.isContractFinished(tokenId).call();


            setContractDetails({
                ...details,
                salary: salaryInEther,
                startDate: startDate,
                endDate: endDate,
                startSeconds: Number(details.startDate),
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
            if (!selectedAccount) {
                alert('Por favor, inicia sesión con tu billetera y selecciona una cuenta.');
            } else {
                const MyContract = await getMyContract();

                MyContract.methods.finalizeContract(tokenId).send({ from: selectedAccount });

                alert('Contrato finalizado con éxito.');

                setContractDetails(prevState => ({
                    ...prevState,
                    isFinished: true
                }));
            }
        } catch (error) {
            console.error("Error al finalizar el contrato:", error);
            alert('Error al finalizar el contrato.');
        }
    };

    const cancelarContrato = async () => {
        try {
            if (!selectedAccount) {
                alert('Por favor, inicia sesión con tu billetera y selecciona una cuenta.');
            } else {
                console.log(tokenId);
                const MyContract = await getMyContract();

                await MyContract.methods.cancelContract(tokenId).send({ from: selectedAccount });

                alert('Contrato cancelado con éxito.');
                navigation.navigate('Home1');
            }
        } catch (error) {
            console.error("Error al cancelar el contrato:", error);
            alert("Error al cancelar el contrato.");
        }
    };

    const signTheContract = async () => {
        if (!tokenId) {
            alert('Falta ID del contrato.');
        }

        try {
            if (!selectedAccount) {
                alert('Por favor, inicia sesión con tu billetera y selecciona una cuenta.');
            } else {
                const MyContract = await getMyContract();

                await MyContract.methods.signContract(tokenId).send({ from: selectedAccount, gas: 1000000 });

                alert('Contrato firmado con éxito.');

                setContractDetails(prevState => ({
                    ...prevState,
                    isSigned: true
                }));

                fetchContractDetailsCallback();
            }
        } catch (error) {
            console.error("Error al firmar el contrato:", error);
            setSignStatus("Error al firmar el contrato");
        }
    };

    const releaseSalary = async () => {
        try {
            if (!selectedAccount) {
                alert('Por favor, inicia sesión con tu billetera y selecciona una cuenta.');
            } else {
                const MyContract = await getMyContract();

                MyContract.methods.releaseSalary(tokenId).send({ from: selectedAccount });

                alert('Salario liberado con éxito.');
                setContractDetails(prevState => ({
                    ...prevState,
                    salaryReleased: true
                }));
            }
        } catch (error) {
            console.error("Error al liberar el salario:", error);
            alert('Error al liberar el salario.');
        }
    };

    const applyChanges = async (tokenId) => {
        try {
            if (!selectedAccount) {
                alert('Por favor, inicia sesión con tu billetera y selecciona una cuenta.');
            } else {
                const { oldDetails, newDetails } = await fetchContractDetails(tokenId);
                navigation.navigate("ApplyChanges", { oldContractDetails: oldDetails, newContractDetails: newDetails });
            }
        } catch (error) {
            console.error("Error al aplicar los cambios:", error);
            alert('Error al aplicar los cambios.');
        }
    };


    const fetchContractDetails = async (tokenId) => {
        try {
            const MyContract = await getMyContract();
            const web3 = await getWeb3();

            const details = await MyContract.methods.contractDetails(tokenId).call();
            const proposal = await MyContract.methods.changeProposals(tokenId).call();
            const employer = await MyContract.methods.getOwnerOfContract(tokenId).call();

            const newTitle = proposal.newTitle ? proposal.newTitle : details.title;

            const salaryInEther = web3.utils.fromWei(details.salary, 'ether');
            const newSalaryInEther = proposal.newSalary ? web3.utils.fromWei(proposal.newSalary, 'ether') : salaryInEther;

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
                {selectedAccount === contractDetails.employer && !contractDetails.isFinished && (
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
                                </>
                            )}

                            {contractDetails.salaryReleased && (
                                <Text style={styles.textoAviso}> El salario ha sido liberado </Text>
                            )}

                            {!contractDetails.isSigned && !contractDetails.isFinished && (
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
                                        onPress={() => { cancelarContrato() }}
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

                    {fromWorkerSection && (
                        <>
                            {!contractDetails.isSigned && contractDetails.employer !== selectedAccount && (
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
                            {contractDetails.isPending && contractDetails.employer !== selectedAccount && (
                                <Boton
                                    texto="Ver petición de modificación"
                                    onPress={() => { applyChanges(contractDetails.tokenId) }}
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
                        </>
                    )
                    }
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


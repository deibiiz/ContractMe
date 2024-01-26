import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import { web3, MyContract1 } from '../ether/web3.js';
import Boton from '../components/Boton';
import Accordion from 'react-native-collapsible/Accordion';

export default function OwnerContracts() {
    const [accountAddress, setAccountAddress] = useState('');
    const [contracts, setContracts] = useState([]);
    const [fetchStatus, setFetchStatus] = useState('');
    const [signedContracts, setSignedContracts] = useState([]);
    const [pendingContracts, setPendingContracts] = useState([]);
    const [finalizedContracts, setFinalizedContracts] = useState([]);
    const [activeSections, setActiveSections] = useState([]);

    const navigation = useNavigation();


    useEffect(() => {
        const loadAccountAndContracts = async () => {
            try {
                const accounts = await web3.eth.getAccounts();
                if (accounts.length > 0) {
                    const account = accounts[0];
                    setAccountAddress(account);

                    await fetchOwnerContracts(account);
                    await fetchSignedContracts(account);

                } else {
                    setFetchStatus("No se encontraron cuentas.");
                }
            } catch (error) {
                console.error("Error al cargar los contratos:", error);
                setFetchStatus("Error al cargar los contratos");
            }
        };

        loadAccountAndContracts();
    }, []);

    const fetchOwnerContracts = async (account) => {
        if (!account) {
            alert('No se encontró la dirección de la cuenta.');
            return;
        }

        try {
            const contractsList = await MyContract1.methods.getContractsFromOwner(account).call();
            let signedOwnerContracts = [];
            let pendingOwnerContracts = [];
            let finalizedOwnerContracts = [];

            for (let contractId of contractsList) {
                const isFinished = await MyContract1.methods.isContractFinished(contractId).call();
                const isSigned = await MyContract1.methods.isContractSigned(contractId).call();

                if (!isFinished) {
                    if (isSigned) {
                        signedOwnerContracts.push(contractId.toString());
                    } else {
                        pendingOwnerContracts.push(contractId.toString());
                    }
                } else {
                    finalizedOwnerContracts.push(contractId.toString());
                }
            }

            setContracts(signedOwnerContracts);
            setPendingContracts(pendingOwnerContracts);
            setFinalizedContracts(finalizedOwnerContracts);

        } catch (error) {
            console.error("Error al obtener los contratos:", error);
            setFetchStatus("Error al buscar los contratos");
        }
    };

    const fetchSignedContracts = async (account) => {
        if (!account) {
            alert('No se encontró la dirección de la cuenta.');
            return;
        }

        try {
            const contractsList = await MyContract1.methods.getContractsOfWorker(account).call();
            const contractIds = contractsList.map(contractId => contractId.toString());
            setSignedContracts(contractIds);
        } catch (error) {
            console.error("Error al obtener los contratos firmados:", error);
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
            setPendingContracts(pendingContracts.filter(id => id !== contractId));
            await fetchOwnerContracts(accounts[0]);
        } catch (error) {
            console.error("Error al cancelar el contrato:", error);
            alert("Error al cancelar el contrato.");
        }
    };

    const updateSections = (activeSections) => {
        setActiveSections(activeSections);
    };

    const renderHeader = (section, _, isActive) => {
        return (
            <View style={isActive ? styles.activeHeader : styles.header}>
                <Text style={styles.headerText}>{section.title}</Text>
            </View>
        );
    };

    const renderContent = (section) => {
        switch (section.title) {
            case 'Contratos como empleador':
                return (
                    <View style={styles.content}>
                        {contracts.length === 0 && pendingContracts.length === 0 && (
                            <Text style={styles.textoAviso}>No se encontraron contratos.</Text>
                        )}
                        {contracts.length != 0 && (
                            <>
                                <Text style={styles.subsectionTitle}>Contratos firmados</Text>
                                {contracts.map((contractId, index) => (
                                    <View key={index} style={styles.contractItem}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text >Contrato ID: {contractId}</Text>
                                            <Boton
                                                texto="Consultar Contrato"
                                                onPress={() => navigation.navigate('infoContract', { tokenId: contractId, fromWorkerSection: false })}
                                                estiloBoton={{
                                                    borderRadius: 5,
                                                    marginLeft: 'auto',
                                                    marginTop: 0,
                                                    width: 180,
                                                    height: 35,
                                                }}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </>
                        )}

                        {pendingContracts.length != 0 && (
                            <>
                                <Text style={styles.subsectionTitle}>Contratos pendientes de firma</Text>
                                {pendingContracts.map((contractId, index) => (
                                    <View key={index} style={styles.contractItem}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text>Contrato ID: {contractId}</Text>
                                            <Boton
                                                texto="Cancelar Contrato"
                                                onPress={() => cancelarContrato(contractId)}
                                                estiloBoton={{
                                                    borderRadius: 5,
                                                    marginLeft: 'auto',
                                                    marginTop: 0,
                                                    width: 180,
                                                    height: 35,
                                                }}

                                            />
                                        </View>
                                    </View>
                                ))}
                            </>
                        )}
                    </View >
                );
            case 'Contratos como trabajador':
                return (
                    <View style={styles.content} >
                        {signedContracts.length === 0 && (
                            <Text style={styles.textoAviso}>No se encontraron contratos.</Text>
                        )}
                        {signedContracts.map((contractId, index) => (
                            <View key={index} style={styles.contractItem}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text>Contrato ID: {contractId}</Text>
                                    <Boton
                                        texto="Consultar Contrato"
                                        onPress={() => navigation.navigate('infoContract', { tokenId: contractId, fromWorkerSection: true })}
                                        estiloBoton={{
                                            borderRadius: 5,
                                            marginLeft: 'auto',
                                            marginTop: 0,
                                            width: 180,
                                            height: 35,
                                        }}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                );
            default:
                return null;
        }
    };

    const SECTIONS = [
        { title: 'Contratos como empleador', content: '' },
        { title: 'Contratos como trabajador', content: '' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView style={{ width: '95%' }}>
                <Text style={{ marginTop: 10 }}>{fetchStatus}</Text>

                <Accordion
                    sections={SECTIONS}
                    activeSections={activeSections}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                    onChange={updateSections}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        paddingTop: 20,
    },
    contractItem: {
        padding: 10,
        marginTop: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    headerText: {
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    subsectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginLeft: 25,
    },
    subsectionContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
    },
    header: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        marginTop: 10,
    },
    activeHeader: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 0,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginTop: 10,

    },
    content: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 0,
        marginTop: -10,
    },
    textoAviso: {
        fontSize: 18,
        color: "#586069",
        marginBottom: 15,
        marginTop: 15,
        fontStyle: "italic",
        textAlign: "center",
        paddingHorizontal: 10,
    },
});
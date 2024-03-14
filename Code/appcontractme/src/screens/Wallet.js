import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Picker, FlatList } from 'react-native';
import Web3 from 'web3';
import { web3, MyContract1 } from '../ether/web3';
import { useAccount } from '../components/ContextoCuenta';
import Boton from '../components/Boton';
import { Button } from 'react-native';
import {
    WalletConnectModal,
    useWalletConnectModal,
} from '@walletconnect/modal-react-native';


const projectId = '8557e5243602df187aa5977b31f1ebca';

const providerMetadata = {
    name: 'YOUR_PROJECT_NAME',
    description: 'YOUR_PROJECT_DESCRIPTION',
    url: 'https://your-project-website.com/',
    icons: ['https://your-project-logo.com/'],
    redirect: {
        native: 'YOUR_APP_SCHEME://',
        universal: 'YOUR_APP_UNIVERSAL_LINK.com',
    },
};

const CarteraScreenn = () => {
    const [accountsList, setAccountsList] = useState([]);
    const { selectedAccount, setSelectedAccount } = useAccount();
    const [balance, setBalance] = useState(0);
    const [events, setEvents] = useState([]);

    const { address, open, isConnected, provider } = useWalletConnectModal();

    const handleConnection = async () => {
        if (isConnected) {
            provider?.disconnect();
            setSelectedAccount(null); // Limpiar la cuenta seleccionada al desconectar
        } else {
            await open(); // Abrir conexión con la billetera
            if (address) {
                setSelectedAccount(address); // Establecer la cuenta conectada como seleccionada
            }
        }
    };


    /*useEffect(() => {
        if (selectedAccount) {
            getAccountHistory(selectedAccount).then(events => {
                setEvents(events);
            }).catch(error => {
                console.error("Error al obtener el historial de la cuenta", error);
                alert("Error al obtener el historial de la cuenta");
            });
        }
    }, [selectedAccount]);
    */

    useEffect(() => {
        const fetchBalance = async () => {
            if (selectedAccount) {
                console.log("selectedAccount", selectedAccount);
                const balanceInWei = await web3.eth.getBalance(selectedAccount);
                console.log("balance:", balanceInWei);
                const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
                setBalance(balanceInEther);
            }
        };
        fetchBalance();
    }, [selectedAccount]);


    const getAccountHistory = async (accoutAddress) => {

        let allEvents = [];

        const SalaryReleasedEvents = await MyContract1.getPastEvents("SalaryReleased", {
            filter: { worker: accoutAddress },
            fromBlock: 0,
            toBlock: "latest"
        });

        allEvents.push(...SalaryReleasedEvents.map(event => ({
            type: "SalaryReleased",
            tokenId: event.returnValues.tokenId.toString(),
            salary: Web3.utils.fromWei(event.returnValues.salary.toString(), "ether"),
            date: new Date(Number(event.returnValues.timestamp) * 1000).toLocaleString()
        })));

        const TokenMintedEvents = await MyContract1.getPastEvents("TokenMinted", {
            filter: { employer: accoutAddress },
            fromBlock: 0,
            toBlock: "latest"
        });

        allEvents.push(...TokenMintedEvents.map(event => ({
            type: "TokenMinted",
            tokenId: event.returnValues.tokenId.toString(),
            salary: Web3.utils.fromWei(event.returnValues.salary.toString(), "ether"),
            date: new Date(Number(event.returnValues.timestamp) * 1000).toLocaleString()
        })));

        const ContractCancelledEvents = await MyContract1.getPastEvents("ContractCancelled", {
            filter: { employer: accoutAddress },
            fromBlock: 0,
            toBlock: "latest"
        });

        allEvents.push(...ContractCancelledEvents.map(event => ({
            type: "ContractCancelled",
            tokenId: event.returnValues.tokenId.toString(),
            salary: Web3.utils.fromWei(event.returnValues.salary.toString(), "ether"),
            date: new Date(Number(event.returnValues.timestamp) * 1000).toLocaleString()
        })));

        const ApprovalChangesEvents = await MyContract1.getPastEvents("ApprovalChanges", {
            filter: { employer: accoutAddress },
            fromBlock: 0,
            toBlock: "latest"
        });

        allEvents.push(...ApprovalChangesEvents.map(event => ({
            type: "ApprovalChanges",
            tokenId: event.returnValues.tokenId.toString(),
            salary: Web3.utils.fromWei(event.returnValues.salary.toString(), "ether"),
            newSalary: Web3.utils.fromWei(event.returnValues.newSalary.toString(), "ether"),
            date: new Date(Number(event.returnValues.timestamp) * 1000).toLocaleString()
        })));

        allEvents.sort((a, b) => b.blockNumber - a.blockNumber);

        return allEvents;
    };

    const eventToText = (eventType) => {
        switch (eventType) {
            case "TokenMinted":
                return "Cración contrato";
            case "ContractCancelled":
                return "Contrato cancelado";
            case "ApprovalChanges":
                return "Modificación salario";
            case "SalaryReleased":
                return "Cobro salario";
            default:
                return eventType;
        }
    };


    const handleAccountChange = (newSelectedAccount) => {
        setSelectedAccount(newSelectedAccount);
    };

    return (
        <View style={styles.container} >

            <Button
                onPress={handleConnection}
                title={isConnected ? 'Disconnect' : 'Connect'}
            />

            {isConnected && (
                <View style={styles.card}>
                    <Text>{selectedAccount}</Text>
                    <Text style={styles.balanceText}>Balance: {balance} ETH</Text>
                </View>
            )}

            <WalletConnectModal
                projectId={projectId}
                providerMetadata={providerMetadata}
            />

            {isConnected && (
                <View style={[styles.card, styles.eventsContainer]}>
                    <FlatList
                        data={events}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            if (item.type !== "ApprovalChanges" || (item.type === "ApprovalChanges" && item.salary !== item.newSalary)) {
                                return (
                                    <View style={styles.contractItem}>

                                        <View style={{ flexDirection: "row" }}>
                                            <Text>{eventToText(item.type)}</Text>
                                            <Text>  ID: {item.tokenId}</Text>
                                        </View>

                                        {item.type === "TokenMinted" && (
                                            <View>
                                                <Text style={styles.lossesText}>-{item.salary} ETH</Text>
                                                <Text style={styles.textoFecha}>{item.date} </Text>
                                            </View>)}

                                        {item.type === "ContractCancelled" && (
                                            <View>
                                                <Text style={styles.profitText}>+{item.salary} ETH</Text>
                                                <Text style={styles.textoFecha}>{item.date} </Text>
                                            </View>)}


                                        {item.type === "ApprovalChanges" && (
                                            <View>
                                                {item.newSalary < item.salary ? (
                                                    <>
                                                        <Text style={styles.profitText}>+{item.salary - item.newSalary} ETH</Text>
                                                        <Text style={styles.textoFecha}>{item.date} </Text>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Text style={styles.lossesText}>-{item.newSalary - item.salary} ETH</Text>
                                                        <Text style={styles.textoFecha}>{item.date} </Text>
                                                    </>
                                                )}
                                            </View>
                                        )}

                                        {item.type === "SalaryReleased" && (
                                            <View>
                                                <Text style={styles.profitText}>+{item.salary} ETH</Text>
                                                <Text style={styles.textoFecha}>{item.date} </Text>
                                            </View>
                                        )}

                                    </View>
                                );
                            } else {
                                return null;
                            }
                        }}
                        ListEmptyComponent={<Text style={styles.textoAviso}>No hay eventos registrados para esta cuenta.</Text>}
                    />
                </View>
            )}

        </View >
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5"
    },
    card: {
        backgroundColor: "white",
        width: "85%",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.3,
        elevation: 2,
        marginVertical: 20
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 14
    },
    accountText: {
        fontSize: 16,
        marginTop: 10
    },
    balanceText: {
        fontSize: 16,
        color: "#4caf50",
        marginTop: 5,
        fontWeight: "bold"
    },
    boton: {
        width: "auto",
        height: 50,
        borderRadius: 13,
        paddingHorizontal: 20,
    },
    picker: {
        width: "100%",
        height: 44,
        marginBottom: 20
    },
    contractItem: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        textAlign: "center"
    },
    eventsContainer: {
        flex: 1,
        marginTop: 20
    },
    profitText: {
        fontSize: 16,
        color: "green",
        fontWeight: "bold"
    },
    lossesText: {
        fontSize: 16,
        color: "red",
        fontWeight: "bold"
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
    textoFecha: {
        fontSize: 14,
        color: "#586069",
        textAlign: "right",
    },
});


export default CarteraScreenn;
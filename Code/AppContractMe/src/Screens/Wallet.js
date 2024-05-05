import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Web3 from 'web3';
import { MyContract, provider } from '../ContractConexion/EtherProvider';
import { useAccount } from '../components/ContextoCuenta';

export default function Wallet() {
    const [accounts, setAccounts] = useState([]);
    const [balance, setBalance] = useState('');
    const [events, setEvents] = useState([]);
    const { selectedAccount, setSelectedAccount } = useAccount();


    useEffect(() => {
        const loadData = async () => {
            const accounts = await provider.eth.getAccounts();
            setAccounts(accounts);
            if (accounts.length > 0) {
                setSelectedAccount(accounts[0]);
                updateBalance(accounts[0]);
            }
        };

        loadData();
    }, [setSelectedAccount]);

    const updateBalance = async (account) => {
        const balance = await provider.eth.getBalance(account);
        const balanceInEth = Web3.utils.fromWei(balance, 'ether');
        setBalance(balanceInEth);
    };

    const handleAccountChange = async (itemValue) => {
        setSelectedAccount(itemValue);
        updateBalance(itemValue);
    };



    useFocusEffect(
        React.useCallback(() => {
            if (selectedAccount) {
                getAccountHistory().then(events => {
                    setEvents(events);
                }).catch(error => {
                    console.error("Error al obtener el historial de la cuenta", error);
                    alert("Error al obtener el historial de la cuenta");
                });
            }
        }, [selectedAccount])
    );

    const getAccountHistory = async () => {

        try {
            const eventTypes = ['TokenMinted', 'SalaryReleased', 'ContractCancelled', 'ApprovalChanges'];
            let allEvents = [];

            for (let eventType of eventTypes) {
                const fetchedEvents = await MyContract.getPastEvents(eventType, {
                    fromBlock: 0,
                    toBlock: 'latest'
                });

                const processedEvents = fetchedEvents.map(event => {
                    let dateString;
                    try {
                        dateString = new Date(parseInt(event.returnValues.timestamp.toString()) * 1000).toLocaleString();
                    } catch (e) {
                        console.error("Error convirtiendo a timestamp:", e);
                        dateString = "Fecha desconocida";
                    }
                    return {
                        ...event,
                        eventName: eventType,
                        returnValues: {
                            ...event.returnValues,
                            salary: event.returnValues.salary ? Web3.utils.fromWei(event.returnValues.salary, 'ether') : null,
                            newSalary: event.returnValues.newSalary ? Web3.utils.fromWei(event.returnValues.newSalary, 'ether') : null,
                            date: dateString,
                        }
                    };
                }).filter(event => {
                    if (eventType === 'SalaryReleased') {
                        return event.returnValues.worker === selectedAccount;
                    } else {
                        return event.returnValues.employer === selectedAccount;
                    }

                });
                allEvents = [...allEvents, ...processedEvents];
            }

            allEvents.sort((a, b) => {

                return parseInt(b.returnValues.timestamp.toString()) - parseInt(a.returnValues.timestamp.toString());
            });
            return allEvents;
        } catch (error) {
            console.error('Error al obtener eventos:', error);
        }
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


    return (
        <View style={styles.container} >
            <View style={styles.card}>
                <Picker
                    selectedValue={selectedAccount}
                    onValueChange={handleAccountChange}
                    style={{ height: 50, width: 250 }}
                >
                    {accounts.map((account, index) => (
                        <Picker.Item key={index} label={account} value={account} />
                    ))}
                </Picker>
                <Text style={styles.text}>Cuenta seleccionada: </Text>
                <Text style={styles.textoAviso}> {selectedAccount}</Text>
                <Text style={styles.balanceText}>Balance: {balance} ETH</Text>
            </View>


            <View style={[styles.card, styles.eventsContainer]}>
                <FlatList
                    data={events}
                    keyExtractor={(item, index) => index.toString()}

                    renderItem={({ item }) => {
                        if (item.eventName !== "ApprovalChanges" || (item.eventName === "ApprovalChanges" && item.returnValues.salary !== item.returnValues.newSalary)) {
                            return (

                                <View style={styles.contractItem}>

                                    <View>
                                        <Text style={styles.textItems} >{eventToText(item.eventName)}</Text>
                                    </View>

                                    {item.eventName === "TokenMinted" && (
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <Text style={styles.lossesText}>-{item.returnValues.salary} ETH</Text>
                                            <Text style={styles.textoFecha}>{item.returnValues.date} </Text>
                                        </View>)}

                                    {item.eventName === "ContractCancelled" && (
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <Text style={styles.profitText}>+{item.returnValues.salary} ETH</Text>
                                            <Text style={styles.textoFecha}>{item.returnValues.date} </Text>
                                        </View>)}

                                    {item.eventName === "SalaryReleased" && (
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            <Text style={styles.profitText}>+{item.returnValues.salary} ETH</Text>
                                            <Text style={styles.textoFecha}>{item.returnValues.date} </Text>
                                        </View>
                                    )}

                                    {item.eventName === "ApprovalChanges" && (
                                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                            {item.returnValues.newSalary < item.returnValues.salary ? (
                                                <>
                                                    <Text style={styles.profitText}>+{item.returnValues.salary - item.returnValues.newSalary} ETH</Text>
                                                    <Text style={styles.textoFecha}>{item.returnValues.date} </Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Text style={styles.lossesText}>-{item.returnValues.newSalary - item.returnValues.salary} ETH</Text>
                                                    <Text style={styles.textoFecha}>{item.returnValues.date} </Text>
                                                </>
                                            )}
                                        </View>
                                    )}
                                </View>
                            );
                        } else {
                            return null;
                        }
                    }
                    }
                    ListEmptyComponent={< Text style={styles.textoAviso} > No hay eventos registrados para esta cuenta.</Text >}
                />
            </View>

        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#f5f5f5"
    },
    card: {
        backgroundColor: "white",
        width: "100%",
        padding: 15,
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
        marginTop: 15,
        fontWeight: "bold",
        textAlign: "center",
    },
    contractItem: {
        backgroundColor: "#F6F6F6",
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        textAlign: "center"
    },
    eventsContainer: {
        flex: 1,
        marginTop: 0
    },
    profitText: {
        fontSize: 16,
        color: "green",
        fontWeight: "bold",
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
        marginTop: 10,
        fontStyle: "italic",
        textAlign: "center",
        paddingHorizontal: 10,
    },
    textoFecha: {
        fontSize: 14,
        color: "#586069",
        textAlign: "right",

    },
    text: {
        fontSize: 16,
        color: "#586069",
        marginBottom: 0,
        marginTop: 0,
        fontWeight: "bold",
        textAlign: "center",
        paddingHorizontal: 10,
    },
    textItems: {
        fontSize: 18,
        color: "black",
        marginBottom: 5,
        marginTop: 0,
    },
});


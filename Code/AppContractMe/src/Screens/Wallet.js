import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Web3 from 'web3';
import { Boton } from '../components/Boton';
import { MyContract, provider } from '../ContractConexion/EtherProvider';
import { useAccount } from '../components/ContextoCuenta';

export default function Wallet() {
    const [accounts, setAccounts] = useState([]);
    const [balance, setBalance] = useState('');
    const [events, setEvents] = useState([]);
    const { selectedAccount, setSelectedAccount } = useAccount();

    /*
        MyContract.events.TokenMinted({
            fromBlock: 0
        }, function (error, event) {
            if (error) console.error(error);
            console.log(event);
        }).on('data', function (event) {
            console.log('Nuevo evento TokenMinted:', event);
            // Aquí puedes manejar la lógica para actuar sobre los datos del evento.
        }).on('error', console.error);
    */

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
                getAccountHistory(selectedAccount).then(events => {
                    setEvents(events);
                }).catch(error => {
                    console.error("Error al obtener el historial de la cuenta", error);
                    //alert("Error al obtener el historial de la cuenta");
                });
            }
        }, [selectedAccount])
    );

    const getAccountHistory = async (accoutAddress) => {

        let allEvents = [];


        const SalaryReleasedFilter = MyContract.filters.SalaryReleased(null, null, null, accoutAddress);
        const TokenMintedFilter = MyContract.filters.TokenMinted(null, accoutAddress);
        const ContractCancelledFilter = MyContract.filters.ContractCancelled(null, accoutAddress);
        const ApprovalChangesFilter = MyContract.filters.ApprovalChanges(null, accoutAddress);

        const SalaryReleasedEvents = await MyContract.queryFilter(SalaryReleasedFilter, 0, "latest");
        const TokenMintedEvents = await MyContract.queryFilter(TokenMintedFilter, 0, "latest");
        const ContractCancelledEvents = await MyContract.queryFilter(ContractCancelledFilter, 0, "latest");
        const ApprovalChangesEvents = await MyContract.queryFilter(ApprovalChangesFilter, 0, "latest");

        const addEvents = (events, type) => {
            events.forEach(event => {
                const eventData = {
                    type: type,
                    tokenId: event.args.tokenId.toString(),
                    salary: ethers.utils.formatEther(event.args.salary.toString()),
                    date: new Date(event.args.timestamp * 1000),
                    dateString: new Date(event.args.timestamp * 1000).toLocaleString(),
                };
                allEvents.push(eventData);
            });
        };

        addEvents(SalaryReleasedEvents, "SalaryReleased");
        addEvents(TokenMintedEvents, "TokenMinted");
        addEvents(ContractCancelledEvents, "ContractCancelled");
        addEvents(ApprovalChangesEvents, "ApprovalChanges");

        allEvents.sort((a, b) => a.date - b.date);
        allEvents.reverse();

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
                <Text>Cuenta seleccionada: {selectedAccount}</Text>
                <Text>Balance: {balance} ETH</Text>
            </View>

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
                                            <Text style={styles.textoFecha}>{item.dateString} </Text>
                                        </View>)}

                                    {item.type === "ContractCancelled" && (
                                        <View>
                                            <Text style={styles.profitText}>+{item.salary} ETH</Text>
                                            <Text style={styles.textoFecha}>{item.dateString} </Text>
                                        </View>)}


                                    {item.type === "ApprovalChanges" && (
                                        <View>
                                            {item.newSalary < item.salary ? (
                                                <>
                                                    <Text style={styles.profitText}>+{item.salary - item.newSalary} ETH</Text>
                                                    <Text style={styles.textoFecha}>{item.dateString} </Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Text style={styles.lossesText}>-{item.newSalary - item.salary} ETH</Text>
                                                    <Text style={styles.textoFecha}>{item.dateString} </Text>
                                                </>
                                            )}
                                        </View>
                                    )}

                                    {item.type === "SalaryReleased" && (
                                        <View>
                                            <Text style={styles.profitText}>+{item.salary} ETH</Text>
                                            <Text style={styles.textoFecha}>{item.dateString} </Text>
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
        marginTop: 5,
        fontWeight: "bold",
        textAlign: "center",
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
    text: {
        fontSize: 16,
        color: "#586069",
        marginBottom: 5,
        marginTop: 20,
        fontWeight: "bold",
        textAlign: "center",
        paddingHorizontal: 10,
    }
});




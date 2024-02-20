import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Picker, FlatList } from 'react-native';
import Web3 from 'web3';
import { MyContract1 } from '../ether/web3';
import { useAccount } from '../components/ContextoCuenta';
import Boton from '../components/Boton';

const CarteraScreen = () => {
    const [loading, setLoading] = useState(false);
    const [accountsList, setAccountsList] = useState([]);
    const { selectedAccount, setSelectedAccount } = useAccount();
    const [balance, setBalance] = useState(0);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            const updateAccounts = async () => {
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const accounts = await web3.eth.getAccounts();
                    setAccountsList(accounts);
                    if (accounts.length > 0 && !selectedAccount) {
                        setSelectedAccount(accounts[0]);
                    }
                } catch (error) {
                    console.error("El usuario rechazó la conexión a la cuenta", error);
                }
                setLoading(false);
            };

            updateAccounts();

            window.ethereum.on('accountsChanged', (newAccounts) => {
                setAccountsList(newAccounts);
                if (newAccounts.length > 0) {
                    setSelectedAccount(newAccounts[0]);
                } else {
                    setSelectedAccount('');
                }
            });
        } else {
            console.log('MetaMask no está instalado');
        }
    }, [setSelectedAccount]);

    useEffect(() => {
        const fetchBalance = async () => {
            if (selectedAccount) {
                const web3 = new Web3(window.ethereum);
                const balanceInWei = await web3.eth.getBalance(selectedAccount);
                const balanceInEther = web3.utils.fromWei(balanceInWei, 'ether');
                setBalance(balanceInEther);
            }
        };

        fetchBalance();
    }, [selectedAccount]);

    const connectToMetaMask = async () => {
        if (loading) {
            console.log('Ya hay una solicitud en curso.');
            return;
        }

        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            setLoading(true);
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const accounts = await web3.eth.getAccounts();
                setAccountsList(accounts);
                if (accounts.length > 0) {
                    setSelectedAccount(accounts[0]);
                } else {
                    console.log('MetaMask está instalado, pero no hay cuentas conectadas.');
                }
            } catch (error) {
                console.error("El usuario rechazó la conexión con la cuenta", error);
            }
            setLoading(false);
        } else {
            console.log('MetaMask no está instalado');
        }
    };

    /*
        event ContractSigned(uint256 indexed tokenId, address indexed worker);
    event SalaryReleased(
        uint256 indexed tokenId,
        uint256 salary,
        address indexed worker
    );
    event TokenMinted(
        uint256 tokenId,
        address indexed employer,
        uint256 salary
    );
    event ContractCancelled(
        uint256 indexed tokenId,
        address indexed employer,
        uint256 salary
    );
    event ApprovalChanges(
        uint256 indexed tokenId,
        address indexed employer,
        int256 salaryDiff
    );
    */

    useEffect(() => {
        if (selectedAccount) {
            getAccountHistory(selectedAccount).then(events => {
                setEvents(events);
            }).catch(error => {
                console.error("Error al obtener el historial de la cuenta", error);
                alert("Error al obtener el historial de la cuenta");
            });
        }
    }, [selectedAccount]);


    const getAccountHistory = async (accoutAddress) => {

        let allEvents = [];

        const ContractSignedEvents = await MyContract1.getPastEvents("ContractSigned", {
            filter: { worker: accoutAddress },
            fromBlock: 0,
            toBlock: 'latest'
        });

        allEvents.push(...ContractSignedEvents.map(event => ({
            type: 'ContractSigned',
            tokenId: event.returnValues.tokenId.toString(),
            salary: Web3.utils.fromWei(event.returnValues.salary.toString(), 'ether'),
        })));

        const SalaryReleasedEvents = await MyContract1.getPastEvents("SalaryReleased", {
            filter: { worker: accoutAddress },
            fromBlock: 0,
            toBlock: 'latest'
        });

        allEvents.push(...SalaryReleasedEvents.map(event => ({
            type: 'SalaryReleased',
            tokenId: event.returnValues.tokenId.toString(),
            salary: Web3.utils.fromWei(event.returnValues.salary.toString(), 'ether'),
        })));

        const TokenMintedEvents = await MyContract1.getPastEvents("TokenMinted", {
            filter: { employer: accoutAddress },
            fromBlock: 0,
            toBlock: 'latest'
        });

        allEvents.push(...TokenMintedEvents.map(event => ({
            type: 'TokenMinted',
            tokenId: event.returnValues.tokenId.toString(),
            salary: Web3.utils.fromWei(event.returnValues.salary.toString(), 'ether'),
        })));

        const ContractCancelledEvents = await MyContract1.getPastEvents("ContractCancelled", {
            filter: { employer: accoutAddress },
            fromBlock: 0,
            toBlock: 'latest'
        });

        allEvents.push(...ContractCancelledEvents.map(event => ({
            type: 'ContractCancelled',
            tokenId: event.returnValues.tokenId.toString(),
            salary: Web3.utils.fromWei(event.returnValues.salary.toString(), 'ether'),
        })));

        const ApprovalChangesEvents = await MyContract1.getPastEvents("ApprovalChanges", {
            filter: { employer: accoutAddress },
            fromBlock: 0,
            toBlock: 'latest'
        });

        allEvents.push(...ApprovalChangesEvents.map(event => ({
            type: 'ApprovalChanges',
            tokenId: event.returnValues.tokenId.toString(),
            salary: Web3.utils.fromWei(event.returnValues.salary.toString(), 'ether'),
            newSalary: Web3.utils.fromWei(event.returnValues.newSalary.toString(), 'ether'),
        })));

        allEvents.sort((a, b) => b.blockNumber - a.blockNumber);

        return allEvents;
    };



    const handleAccountChange = (newSelectedAccount) => {
        setSelectedAccount(newSelectedAccount);
    };

    return (
        <View style={styles.container} >
            {!selectedAccount ? (
                <Boton
                    texto={loading ? "Conectando..." : "Conectar con MetaMask"}
                    estiloBoton={styles.boton}
                    onPress={connectToMetaMask}
                    disabled={loading}
                />
            ) : (
                <View style={styles.card}>
                    {accountsList.length > 1 && (
                        <View>
                            <Text style={styles.title}>Selecciona una cuenta:</Text>
                            <Picker
                                selectedValue={selectedAccount}
                                onValueChange={handleAccountChange}
                                style={styles.picker}
                            >
                                {accountsList.map(acc => (
                                    <Picker.Item key={acc} label={acc} value={acc} />
                                ))}
                            </Picker>
                        </View>
                    )}
                    <Text style={styles.balanceText}>Balance: {balance} ETH</Text>
                </View>
            )}
            <View style={styles.card}>
                <FlatList
                    data={events}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.contractItem}>
                            <Text>{item.type}</Text>
                            <Text>Token ID: {item.tokenId}</Text>
                            {item.type != "ApprovalChanges" && <Text>Salario: {item.salary} ETH</Text>}
                            {item.type === "ApprovalChanges" && (
                                <Text>Nuevo salario: {item.newSalary - item.salary} ETH</Text>)}
                        </View>
                    )}
                    ListEmptyComponent={<Text>No hay eventos registrados para esta cuenta.</Text>}
                />
            </View>
        </View >
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    card: {
        backgroundColor: 'white',
        width: '85%',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.3,
        elevation: 2,
        marginVertical: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 14
    },
    accountText: {
        fontSize: 16,
        marginTop: 10
    },
    balanceText: {
        fontSize: 16,
        color: '#4caf50',
        marginTop: 5,
        fontWeight: 'bold'
    },
    boton: {
        width: 'auto',
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
        backgroundColor: '#f0f0f0',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        textAlign: 'center'
    }

});


export default CarteraScreen;
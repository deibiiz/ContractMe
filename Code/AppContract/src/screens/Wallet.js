import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Picker } from 'react-native';
import Web3 from 'web3';
import { useAccount } from '../components/ContextoCuenta';
import Boton from '../components/Boton';

const CarteraScreen = () => {
    const [loading, setLoading] = useState(false);
    const [accountsList, setAccountsList] = useState([]);
    const { selectedAccount, setSelectedAccount } = useAccount();
    const [balance, setBalance] = useState(0);

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

    const handleAccountChange = (newSelectedAccount) => {
        setSelectedAccount(newSelectedAccount);
    };

    return (
        <View style={styles.container}>
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
                    <Text style={styles.accountText}>Cuenta: {selectedAccount}</Text>
                    <Text style={styles.balanceText}>Balance: {balance} ETH</Text>
                </View>
            )}
        </View>
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
    }
});


export default CarteraScreen;
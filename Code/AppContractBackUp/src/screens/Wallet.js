import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import '@walletconnect/react-native-compat'
import { WagmiConfig } from 'wagmi'
import { sepolia } from 'viem/chains'
import { createWeb3Modal, defaultWagmiConfig, Web3Modal } from '@web3modal/wagmi-react-native'
import { useWeb3Modal } from '@web3modal/wagmi-react-native'
import { useAccount, useDisconnect, useContractWrite } from 'wagmi'
import "react-native-get-random-values"
import "@ethersproject/shims"
import { ethers } from "ethers";
import ABI from '../ether/MyContractAux.json'


export default function WalletScreen() {
    const { open } = useWeb3Modal()
    const { disconnect } = useDisconnect()
    const { isConnected, address } = useAccount()
    const [IsContractSigned, setIsContractSigned] = useState();
    const [TxHash, setTxHash] = useState('');

    const { writeAsync } = useContractWrite({
        address: '0x3eA2717cf5AE3ccc89d868fB317aE938b6aC8EBc',
        abi: ABI,
        functionName: 'mint',
    })

    async function isContractSigned() {
        const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/d2fa416c31e348ef82c706d0a1e24fc8');
        const contractAddress = '0x3eA2717cf5AE3ccc89d868fB317aE938b6aC8EBc';
        const contract = new ethers.Contract(contractAddress, ABI, provider);
        const result = await contract.isContractSigned(6);
        var resNum = Number(result);
        setIsContractSigned(resNum.toString());
        console.log(result);
    }

    async function writeToContract() {
        // Asegúrate de tener una dirección desde la cual estás enviando la transacción.
        if (!address) {
            console.error('Wallet not connected');
            return;
        }

        // Asume que ya tienes definidos o puedes obtener los valores para _to, _salary, _start, _duration, _description, _title
        const _to = "0x922Fd344AE304f3baC6b2f5f459E056ADFC2cf24"; // Por ejemplo, usar la dirección conectada
        const _salary = ethers.utils.parseEther('0.001'); // Convertir 1 ether a wei, ajusta según necesidad
        const _salaryNumber = Number(_salary); // Convertir 1 ether a wei, ajusta según necesidad
        const _start = Number(1); // Fecha de inicio en segundos desde epoch, ajusta según necesidad
        const _duration = Number(360000); // Duración en segundos, ajusta según necesidad
        const _description = "Description of the minted item2"; // Descripción
        const _title = "Title of the minted item2"; // Título

        const tx = await writeAsync({
            args: [
                _to,
                _salaryNumber,
                _start,
                _duration,
                _description,
                _title,
            ],
            value: _salaryNumber,
        });

        console.log(tx);
        setTxHash(tx.hash);
    }

    async function signToContract() {

        const _tokenID = Number(6);

        const tx = await writeAsync({
            args: [
                _tokenID,
            ],
        });

        console.log(tx);
        setTxHash(tx.hash);
    }


    return (
        <View style={styles.container}>
            {IsContractSigned &&
                <Text>
                    Result: {IsContractSigned}
                </Text>
            }
            <Button
                onPress={isContractSigned}
                title={"read"}
            />

            {TxHash &&
                <Text>
                    Transaction: {TxHash}
                </Text>
            }
            <Button
                onPress={writeToContract}
                title={"write"}
            />
            <Button
                onPress={signToContract}
                title={"sign"}
            />

            <Button
                onPress={!isConnected ? open : disconnect}
                title={isConnected ? 'Disconnect' : 'Connect'}
            />
            {isConnected && (
                <>
                    <Text style={styles.text}>{address}</Text>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#black',
        alignItems: 'center',
        justifyContent: 'center',
    },
});





/*

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Web3 from "web3";
import { web3, MyContract1 } from "../ether/web3";
import { useAccount } from "../components/ContextoCuenta";
import { Picker } from "@react-native-picker/picker";


const CarteraScreen = () => {
    const { selectedAccount, setSelectedAccount } = useAccount();
    const [balance, setBalance] = useState(0);
    const [events, setEvents] = useState([]);
    const [availableAccounts, setAvailableAccounts] = useState([]);


    useEffect(() => {
        const fetchAccounts = async () => {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length > 0) {
                setAvailableAccounts(accounts);
                setSelectedAccount(accounts[0]);
                const balanceInWei = await web3.eth.getBalance(accounts[0]);
                const balanceInEther = web3.utils.fromWei(balanceInWei, "ether");
                setBalance(balanceInEther);
            }
        };

        fetchAccounts();
    }, []);

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
            <View style={styles.card}>
                <Picker
                    selectedValue={selectedAccount}
                    onValueChange={(itemValue, itemIndex) => handleAccountChange(itemValue)}
                    style={styles.picker}
                >
                    {availableAccounts.map((account, index) => (
                        <Picker.Item key={index} label={account} value={account} />
                    ))}

                </Picker>

                <Text style={styles.balanceText}>Balance: {balance} ETH</Text>
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
        width: "100%",
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


export default CarteraScreen;

*/
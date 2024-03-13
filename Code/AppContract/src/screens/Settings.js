import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Web3 from 'web3';
import { useAccount } from '../components/ContextoCuenta';
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
    const Url = "https://sepolia.infura.io/v3/d2fa416c31e348ef82c706d0a1e24fc8";
    const web3 = new Web3(new Web3.providers.HttpProvider(Url));

    const { selectedAccount, setSelectedAccount } = useAccount();
    const [balance, setBalance] = useState(0);

    const { address, open, isConnected, provider } = useWalletConnectModal();

    const handleConnection = async () => {
        if (isConnected) {
            provider?.disconnect();
            setSelectedAccount(null);
        } else {
            await open();
            if (address) {
                setSelectedAccount(address);
            }
        }
    };

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

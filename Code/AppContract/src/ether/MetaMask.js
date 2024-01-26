import { useState, useEffect } from 'react';
import { useSDK } from "@metamask/sdk-react";

const MetaMask = () => {
    const { connect, disconnect, account, chainId, ethereum } = useSDK();
    const [isConnected, setIsConnected] = useState(false);

    const connectWallet = async () => {
        try {
            await connect();
            setIsConnected(true);
        } catch (error) {
            console.error("Error al conectar la billetera:", error);
            setIsConnected(false);
        }
    };

    useEffect(() => {
        if (account && chainId) {
            setIsConnected(true);
        } else {
            setIsConnected(false);
        }
    }, [account, chainId]);

    return { connectWallet, isConnected, account, ethereum };
};

export default MetaMask;

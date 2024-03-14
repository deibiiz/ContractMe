import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from "web3";
import { useWalletConnectModal } from '@walletconnect/modal-react-native';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
    const { address, open, isConnected, provider } = useWalletConnectModal();
    const [selectedAccount, setSelectedAccount] = useState(address);
    const [web3Instance, setWeb3] = useState(null);

    useEffect(() => {
        setSelectedAccount(address);
        if (provider) {
            const web3 = new Web3(provider);
            setWeb3(web3);
        } else {
            setWeb3(null);
        }
    }, [provider]);

    const handleConnection = () => {
        if (isConnected) {
            return provider?.disconnect();
        }

        return open();
    };

    return (
        <AccountContext.Provider value={{ selectedAccount, setSelectedAccount, handleConnection, isConnected, web3Instance }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccount = () => useContext(AccountContext);

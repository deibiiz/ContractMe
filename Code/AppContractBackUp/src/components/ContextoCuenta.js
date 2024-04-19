import React, { createContext, useContext, useState } from 'react';

const AccountContext = createContext();

export const useAccount = () => useContext(AccountContext);

export const AccountProvider = ({ children }) => {
    const [selectedAccount, setSelectedAccount] = useState('');

    return (
        <AccountContext.Provider value={{ selectedAccount, setSelectedAccount }}>
            {children}
        </AccountContext.Provider>
    );
};

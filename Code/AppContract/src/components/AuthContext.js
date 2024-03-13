import React, { createContext, useContext } from 'react';

const AuthenticationContext = createContext();

export const useAuth = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children, AutenticarConHuella, AutenticarDirecto }) => {
    return (
        <AuthenticationContext.Provider value={{ AutenticarConHuella, AutenticarDirecto }}>
            {children}
        </AuthenticationContext.Provider>
    );
};

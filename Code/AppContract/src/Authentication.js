import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

export const useAuthentication = () => {
    const [soportaBiometrico, setSoportaBiometrico] = useState(false);
    const [esAutenticado, setEsAutenticado] = useState(false);

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setSoportaBiometrico(compatible);
        })();
    }, []);

    const AutenticarConHuella = async () => {
        try {
            if (soportaBiometrico) {
                const resultado = await LocalAuthentication.authenticateAsync({
                    promptMessage: "Ingresar con huella digital"
                });
                setEsAutenticado(resultado.success);
            } else {
                alert("Este dispositivo no soporta autenticación biométrica.");
            }
        } catch (error) {
            console.error("Error en autenticación biométrica", error);
        }
    };

    const AutenticarDirecto = () => {
        setEsAutenticado(true);
    };

    return { esAutenticado, AutenticarConHuella, AutenticarDirecto };
};

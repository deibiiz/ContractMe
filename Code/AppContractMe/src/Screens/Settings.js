
import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { useAccount } from '../components/ContextoCuenta';
import { MyContract, provider } from '../ContractConexion/EtherProvider';

export default function Settings() {

    const { selectedAccount } = useAccount();


    useEffect(() => {
        fetchContractDetails();
    }, []);

    const fetchContractDetails = async () => {
        try {
            const details = await MyContract.methods.tokenExists(1).call();
            console.log("token:", details);
        } catch (error) {
            console.error("Error al obtener detalles del contrato:", error);
        }
    }



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


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <Text>No hay transacciones para mostrar.</Text>

        </View>
    );
}
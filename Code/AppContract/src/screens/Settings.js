import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAccount, useDisconnect } from 'wagmi';

const Settings = () => {
    const { isConnected, address } = useAccount();
    const { disconnect } = useDisconnect();

    const handleDisconnect = async () => {
        await disconnect();
        disconnectWallet();
    };


    return (
        <View style={styles.container}>
            <>
                <Text style={styles.text}>Conectado como: {address}</Text>
                <Button onPress={handleDisconnect} title="Desconectar" />
            </>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        marginBottom: 20,
    },
});

export default Settings;

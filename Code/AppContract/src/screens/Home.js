import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Boton from "../components/Boton";

const Home = () => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <Boton
                texto="Crear Contrato"
                onPress={() => navigation.navigate('CreateContract')}
            />
            <Boton
                texto="Verificar Contrato"
                onPress={() => navigation.navigate('infoContract')}
            />
        </View>
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

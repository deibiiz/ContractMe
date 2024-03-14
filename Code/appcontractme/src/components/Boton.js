import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { View } from "react-native";

export default function Boton({ texto, onPress, estiloBoton, estiloTexto }) {
    return (
        <TouchableOpacity style={[styles.container, estiloBoton]} onPress={onPress}>
            <View
                style={[styles.boton, estiloBoton]}
            >
                <Text style={[styles.texto, estiloTexto]}>{texto}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    texto: {
        fontSize: 14,
        color: "white",
        fontWeight: "bold",
    },
    boton: {
        borderRadius: 25,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#164863",
    },

});
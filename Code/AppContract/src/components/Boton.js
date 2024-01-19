import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { View } from 'react-native';



export default function Boton({ texto, onPress, estiloBoton, estiloTexto }) {
    return (
        <TouchableOpacity style={[styles.container, estiloBoton]} onPress={onPress}>
            <View
                style={[styles.boton, estiloBoton, { backgroundColor: '#2BA6FF' }]}
            >
                <Text style={[styles.texto, estiloTexto]}>{texto}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 250,
        alignItems: "center",
        marginTop: 30,
    },
    texto: {
        fontSize: 14,
        color: "black",
        fontWeight: "bold",
    },
    boton: {
        marginTop: 10,
        width: "80%",
        height: 50,
        borderRadius: 25,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
    },

});
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../AppLogin/firebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";
import Boton from "../components/Boton";

export default function Settings() {
    const navigation = useNavigation();
    const [userData, setUserData] = useState({
        apellido: "",
        ciudad: "",
        direccion: "",
        dni: "",
        fecha: null,
        ganache: "",
        nombre: "",
        pais: "",
        paidCode: "",
        telefono: "",
        email: "",
    });

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, "users", user.uid);
            const unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const email = user.email;
                    const fecha = data.fecha ? data.fecha.toDate() : null;
                    setUserData({ ...data, email, fecha: fecha ? new Date(fecha).toLocaleDateString() : "No disponible" });
                } else {
                    console.log("No se ha encontrado documento");
                }
            }, error => {
                console.error("No se han detectado cambios:", error);
            });

            return () => unsubscribe();
        }
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("Se ha cerrado bien la sesión");
        } catch (error) {
            console.error("Error cerrando sesión: ", error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={styles.textIconTitle}>
                    <MaterialIcons name="person" size={24} color="black" />
                    <Text style={styles.header}>Perfil de usuario</Text>
                </View>

                <View style={styles.textIcon}>
                    <MaterialIcons name="badge" size={18} color="black" />
                    <Text style={styles.text}>Nombre:  {userData.nombre} {userData.apellido1} {userData.apellido2}</Text>
                </View>

                <View style={styles.textIcon}>
                    <MaterialIcons name="email" size={18} color="black" />
                    <Text style={styles.text}> Email:  {userData.email}</Text>
                </View>

                <View style={styles.textIcon}>
                    <MaterialIcons name="credit-card" size={18} color="black" />
                    <Text style={styles.text}>DNI:  {userData.dni}</Text>
                </View>

                <View style={styles.textIcon}>
                    <MaterialIcons name="calendar-today" size={18} color="black" />
                    <Text style={styles.text}>Fecha de nacimiento:  {userData.fecha}</Text>
                </View>

                <View style={styles.textIcon}>
                    <MaterialIcons name="home" size={18} color="black" />
                    <Text style={styles.text}>Dirección:  {userData.direccion}, {userData.ciudad}, {userData.pais}</Text>
                </View>

                <View style={styles.textIcon}>
                    <MaterialIcons name="phone" size={18} color="black" />
                    <Text style={styles.text}>Teléfono:  {userData.telefono}</Text>
                </View>

                <View style={styles.textIcon}>
                    <MaterialIcons name="link" size={18} color="black" />
                    <Text style={styles.text}>Ganache Address:  {userData.ganache}</Text>
                </View>
            </View>

            <View style={styles.buttonGroup}>
                <Boton
                    texto="Modificar Perfil"
                    onPress={() => navigation.navigate("Profile", { userData: userData })}
                    estiloBoton={
                        {
                            borderRadius: 5,
                            marginBottom: 7,
                            width: 300,
                        }
                    }
                />
                <Boton
                    texto="Cerrar Sesión"
                    onPress={handleSignOut}
                    estiloBoton={
                        {
                            borderRadius: 5,
                            width: 300,
                            backgroundColor: "#FE4545",
                        }
                    }
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f0f0f0",
    },
    card: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 15,
        width: "100%",
        maxWidth: 400,
        shadowColor: "black",
        elevation: 6,
        marginBottom: 25,
    },
    header: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginLeft: 10,
    },
    textIconTitle: {
        flexDirection: "row",
        alignItems: "center",
        fontSize: 16,
        marginTop: 8,
        marginBottom: 25,
    },
    textIcon: {
        flexDirection: "row",
        alignItems: "center",
        fontSize: 15,
        marginTop: 15,
    },
    text: {
        fontSize: 15,
        marginLeft: 10,
        marginRight: 10,
    },
    buttonGroup: {
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20,
    },
});

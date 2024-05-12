import React from "react";
import { View, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../AppLogin/firebaseConfig";

export default function Settings() {


    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("Se ha cerrado bien la sesión");
        } catch (error) {
            console.error("Error cerrando sesión: ", error);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button title="Cerrar Sesión" onPress={handleSignOut} />
        </View>
    );
}

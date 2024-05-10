import React from 'react';
import { Text, View } from 'react-native';

export default function Settings() {
    return (
        <View>
            <Text>Hello World</Text>
        </View>
    );
}


/*

import React from 'react';
import { Text, View, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../AppLogin/firebaseConfig';


export default function Settings() {

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully!");
            // Opcional: maneja lo que sucede después que el usuario cierra sesión
            // Por ejemplo, actualizar el estado del usuario o redirigir a la pantalla de login
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button title="Sign Out" onPress={handleSignOut} />
        </View>
    );
}

*/
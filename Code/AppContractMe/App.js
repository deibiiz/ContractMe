import React, { useState } from 'react';
import { StyleSheet, View, Button, Text, TextInput } from 'react-native';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db, doc, setDoc } from './firebaseConfig';
import { NavigationContainer } from '@react-navigation/native';
import { AccountProvider } from "./src/components/ContextoCuenta";
import auxx from './src/auxx';

//import AppNavigation from "./src/Navigation";





export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [color, setColor] = useState('');

  const handleLogin = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, "admin1@gmail.com", "admin1");
      setUser(response.user);
      setError('');

      // Guarda el color favorito en Firestore
      await setDoc(doc(db, "users", response.user.uid), {
        email: email,
        favoriteColor: color
      });

      if (user) {
        console.log('Usuario logueado');
      }
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <View style={styles.container}>
      <Button title="Login" onPress={handleLogin} />
      {user && <Text>Welcome, {user.email}</Text>}
      {error && <Text>Error: {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  input: {
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});


/*

import "./global";
import React, { useState, useEffect } from 'react';
import { auth } from './src/AppLogin/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import LoginScreen from './src/AppLogin/Login';
import MainNavigation from './src/Navigation';
import { NavigationContainer } from '@react-navigation/native';
import { AccountProvider } from "./src/components/ContextoCuenta";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Usuario logueado', user.email);
        setUser(user);
      } else {
        console.log("no hay usuario logueado");
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AccountProvider>
      <NavigationContainer>
        {user ? <MainNavigation /> : <LoginScreen onLoginSuccess={setUser} />}
      </NavigationContainer>
    </AccountProvider>
  );
}


*/
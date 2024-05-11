import "./global";
import "react-native-get-random-values";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button } from "react-native";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AccountProvider } from "./src/components/ContextoCuenta";
import Navigation from "./src/Navigation";


export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const data = await AsyncStorage.getAllKeys();
    console.log(data, "async")

    try {
      const response = await signInWithEmailAndPassword(auth, "admin1@gmail.com", "admin1");
      setUser(response.user);
      setError("");

      if (user) {
        console.log("Usuario logueado");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("usuario logueado:", user);
      } else {
        setUser(null);
        console.log("usurio no logueado");
      }
    });

    return () => unsubscribe();
  }, []);


  if (!user) {
    return (
      <View style={styles.container}>
        <Button title="Login" onPress={handleLogin} />
      </View>
    );
  }

  if (user) {
    return (
      <AccountProvider>
        <Navigation />
      </AccountProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  input: {
    height: 40,
    width: 250,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});



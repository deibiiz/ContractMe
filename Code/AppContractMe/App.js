import "./global";
import "react-native-get-random-values";
import React, { useState, useEffect } from "react";
import { auth } from "./src/AppLogin/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { AccountProvider } from "./src/components/ContextoCuenta";
import Navigation from "./src/Navigation";
import Login from "./src/AppLogin/Login";


export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("usuario logueado:", user);
      } else {
        setUser(null);
        console.log("usurio no logueado:", user);
      }
    });
    return () => unsubscribe();
  }, []);


  if (!user) {
    return (
      <Login />
    );
  } else {
    return (
      <AccountProvider>
        <Navigation />
      </AccountProvider>
    );
  }
}




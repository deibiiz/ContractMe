import "./global";
import "react-native-get-random-values";
import React, { useState } from "react";
import { AccountProvider } from "./src/components/ContextoCuenta";
import AppNavigation from "./src/Navigation";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./src/AppLogin/Login";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <AccountProvider>
      <NavigationContainer>
        {isAuthenticated ? <AppNavigation /> : <Login onLogin={handleLogin} />}
      </NavigationContainer>
    </AccountProvider>
  );
}

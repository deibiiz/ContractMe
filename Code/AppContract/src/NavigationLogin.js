import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useAuthentication } from "./appLogin/Authentication";
import { AuthenticationProvider } from "./components/AuthContext";

import Login from "./appLogin/Login";
import Register from "./appLogin/Register";
import ResetPassword from "./appLogin/ResetPassword";
import MainNavigation from "./Navigation";

const Stack = createStackNavigator();



export default function AppNavigation() {
    const { esAutenticado, AutenticarConHuella, AutenticarDirecto } = useAuthentication();

    return (
        <AuthenticationProvider AutenticarConHuella={AutenticarConHuella} AutenticarDirecto={AutenticarDirecto}>
            <NavigationContainer>
                {esAutenticado ? (
                    <MainNavigation />
                ) : (
                    <Stack.Navigator initialRouteName="Login">
                        <Stack.Screen
                            name="Login"
                            component={Login}
                            options={{
                                headerShown: false,
                                title: "Inicio de Sesión"
                            }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={Register}
                            options={{
                                title: "Registro",
                                headerStyle: {
                                    backgroundColor: "#9BBEC8",
                                },
                            }}
                        />
                        <Stack.Screen
                            name="ResetPassword"
                            component={ResetPassword}
                            options={{
                                title: "Restablecer Contraseña", headerStyle: {
                                    backgroundColor: "#9BBEC8",
                                },
                            }}
                        />
                    </Stack.Navigator>
                )}
            </NavigationContainer>
        </AuthenticationProvider>
    );
}

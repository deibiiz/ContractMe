import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthentication } from './src/appLogin/Authentication';
import { AccountProvider } from './src/components/ContextoCuenta';

import Login from './src/appLogin/Login';
import Register from './src/appLogin/Register';
import MainNavigation from './src/Navigation';

const Stack = createStackNavigator();

export default function App() {
  const { esAutenticado, AutenticarConHuella, AutenticarDirecto } = useAuthentication();

  return (
    <AccountProvider>
      <NavigationContainer>
        {esAutenticado ? (
          <MainNavigation />
        ) : (
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={(props) => <Login {...props} AutenticarConHuella={AutenticarConHuella} AutenticarDirecto={AutenticarDirecto} />}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={Register}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AccountProvider>
  );
}


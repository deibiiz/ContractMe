import "./global";
import 'react-native-get-random-values';
import React from 'react';
import { AccountProvider } from './src/components/ContextoCuenta';
import AppNavigation from './src/Navigation';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <AccountProvider>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </AccountProvider>
  );
}

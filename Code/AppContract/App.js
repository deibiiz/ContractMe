import React from 'react';
import "./globals.js";
import 'react-native-get-random-values';
import { AccountProvider } from './src/components/ContextoCuenta';
import AppNavigation from './src/NavigationLogin';

export default function App() {
  return (
    <AccountProvider>
      <AppNavigation />
    </AccountProvider>
  );
}

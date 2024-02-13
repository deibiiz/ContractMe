import React from 'react';
import { AccountProvider } from './src/components/ContextoCuenta';
import AppNavigation from './src/NavigationLogin';

export default function App() {
  return (
    <AccountProvider>
      <AppNavigation />
    </AccountProvider>
  );
}

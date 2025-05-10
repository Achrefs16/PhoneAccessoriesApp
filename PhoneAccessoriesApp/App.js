/* App.js - Main entry point */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import {CartProvider} from './src/contexts/CartContext';

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </CartProvider>
  );
}
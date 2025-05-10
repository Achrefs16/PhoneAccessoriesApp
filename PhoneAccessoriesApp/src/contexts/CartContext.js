import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      if (cart) setCartItems(JSON.parse(cart));
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async (items) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (accessory) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.accessory.id === accessory.id);
      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.accessory.id === accessory.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...prevItems, { accessory, quantity: 1 }];
      }
      saveCart(newItems);
      return newItems;
    });
  };

  const updateQuantity = (accessoryId, quantity) => {
    setCartItems((prevItems) => {
      let newItems;
      if (quantity <= 0) {
        newItems = prevItems.filter(item => item.accessory.id !== accessoryId);
      } else {
        newItems = prevItems.map(item =>
          item.accessory.id === accessoryId ? { ...item, quantity } : item
        );
      }
      saveCart(newItems);
      return newItems;
    });
  };

  const removeFromCart = (accessoryId) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter(item => item.accessory.id !== accessoryId);
      saveCart(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  const total = cartItems.reduce((sum, item) => sum + item.accessory.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
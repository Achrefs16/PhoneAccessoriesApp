import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrdersScreen from '../screens/OrdersScreen';
import { Icon } from 'react-native-elements';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={({ navigation }) => ({
        title: 'Accessoires Téléphoniques',
        headerRight: () => (
          <Icon
            name="shopping-cart"
            size={24}
            onPress={() => navigation.navigate('Cart')}
            containerStyle={{ marginRight: 16 }}
          />
        ),
      })}
    />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Accueil" component={HomeStack} />
    <Drawer.Screen name="Mon Profil" component={ProfileScreen} />
    <Drawer.Screen name="Mon Panier" component={CartScreen} />
    <Drawer.Screen name="Mes Commandes" component={OrdersScreen} />
  </Drawer.Navigator>
);

export default AppNavigator;
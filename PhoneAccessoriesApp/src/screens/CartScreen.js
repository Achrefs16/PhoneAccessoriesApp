/* src/screens/CartScreen.js - Cart screen for managing items */
import React, { useState } from 'react';
import { View, FlatList, Text, StyleSheet, Alert, TextInput } from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';
import { useCart } from '../contexts/CartContext';
import { apiService } from '../api/apiService';

const CartScreen = ({ navigation }) => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, total } = useCart();
  const [address, setAddress] = useState('');

  const showCheckoutDialog = () => {
    Alert.alert(
      'Finaliser la commande',
      'Veuillez entrer votre adresse de livraison:',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Confirmer',
          onPress: async () => {
            if (!address) {
              Alert.alert('Erreur', 'Veuillez entrer une adresse valide');
              return;
            }
            try {
              await apiService.placeOrder(cartItems, address);
              clearCart();
              setAddress('');
              navigation.replace('Mes Commandes');
              Alert.alert('Succès', 'Commande passée avec succès!');
            } catch (error) {
              Alert.alert('Erreur', 'Erreur lors de la commande. Veuillez réessayer.');
            }
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => setAddress(''),
      }
    );
  };

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.item}>
        <Image source={{ uri: item.accessory.image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.name}>{item.accessory.name}</Text>
          <Text style={styles.price}>{item.accessory.price.toFixed(2)} €</Text>
          <View style={styles.quantity}>
            <Icon
              name="remove"
              onPress={() => updateQuantity(item.accessory.id, item.quantity - 1)}
            />
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <Icon
              name="add"
              onPress={() => updateQuantity(item.accessory.id, item.quantity + 1)}
            />
            <Icon
              name="delete"
              color="red"
              onPress={() => removeFromCart(item.accessory.id)}
            />
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        <Text style={styles.empty}>Votre panier est vide</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={item => item.accessory.id.toString()}
          />
          <View style={styles.footer}>
            <Text style={styles.total}>Total: {total.toFixed(2)} €</Text>
            <TextInput
              style={styles.addressInput}
              placeholder="Adresse complète"
              value={address}
              onChangeText={setAddress}
              multiline
            />
            <Button
              title="Passer la commande"
              disabled={cartItems.length === 0}
              onPress={showCheckoutDialog}
              buttonStyle={styles.button}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { margin: 8 },
  item: { flexDirection: 'row' },
  image: { width: 50, height: 50, marginRight: 8 },
  details: { flex: 1 },
  name: { fontWeight: 'bold' },
  price: { color: '#007AFF' },
  quantity: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  quantityText: { marginHorizontal: 8 },
  footer: { padding: 16 },
  total: { fontSize: 18, fontWeight: 'bold' },
  addressInput: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8, borderRadius: 4 },
  button: { backgroundColor: '#007AFF' },
  empty: { textAlign: 'center', marginTop: 20 },
});

export default CartScreen;
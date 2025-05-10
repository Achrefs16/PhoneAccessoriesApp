import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { useCart } from '../contexts/CartContext';

const AccessoryCard = ({ accessory }) => {
  const { addToCart } = useCart();

  return (
    <Card containerStyle={styles.card}>
      <Image
        source={{ uri: accessory.image }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{accessory.name}</Text>
        <Text style={styles.price}>{accessory.price.toFixed(2)} €</Text>
        <View style={styles.footer}>
          <Text style={styles.brand}>{accessory.brand}</Text>
          <TouchableOpacity onPress={() => addToCart(accessory)}>
            <Icon name="add-shopping-cart" color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: { margin: 5, padding: 0, borderRadius: 8 },
  image: { width: '100%', height: 150 },
  content: { padding: 8 },
  name: { fontWeight: 'bold', fontSize: 16 },
  price: { color: '#007AFF', fontWeight: 'bold', marginVertical: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#666', fontSize: 12 },
});

export default AccessoryCard;

import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements';
import { apiService } from '../api/apiService';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getOrderHistory();
      setOrders(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Erreur lors du chargement des commandes');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En attente': return 'orange';
      case 'Expédiée': return 'blue';
      case 'Livrée': return 'green';
      case 'Annulée': return 'red';
      default: return 'grey';
    }
  };

  const renderItem = ({ item }) => (
    <Card containerStyle={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Commande #{item.id}</Text>
        <Text style={styles.total}>{item.total.toFixed(2)} €</Text>
      </View>
      <View style={styles.subtitle}>
        <Text>{formatDate(item.date)}</Text>
        <Text style={[styles.status, { backgroundColor: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
      {item.items.map((cartItem, index) => (
        <View key={index} style={styles.item}>
          <Image source={{ uri: cartItem.accessory.image }} style={styles.image} />
          <View style={styles.itemDetails}>
            <Text>{cartItem.accessory.name}</Text>
            <Text>Quantité: {cartItem.quantity}</Text>
            <Text>{(cartItem.accessory.price * cartItem.quantity).toFixed(2)} €</Text>
          </View>
        </View>
      ))}
      <Text style={styles.details}>Détails de livraison:</Text>
      <View style={styles.progress} />
    </Card>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : orders.length === 0 ? (
        <Text style={styles.empty}>Aucune commande trouvée</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { margin: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontWeight: 'bold', fontSize: 16 },
  total: { fontWeight: 'bold', fontSize: 16 },
  subtitle: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  status: { color: '#fff', padding: 4, borderRadius: 4 },
  item: { flexDirection: 'row', marginVertical: 4 },
  image: { width: 40, height: 40, marginRight: 8 },
  itemDetails: { flex: 1 },
  details: { marginTop: 8 },
  progress: { height: 4, backgroundColor: '#007AFF', marginVertical: 8 },
  empty: { textAlign: 'center', marginTop: 20 },
});

export default OrdersScreen;
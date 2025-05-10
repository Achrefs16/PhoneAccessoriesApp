import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Chip } from 'react-native-elements';
import AccessoryCard from '../components/AccessoryCard';
import SearchBar from '../components/SearchBar';
import { apiService } from '../api/apiService';

const HomeScreen = ({ navigation }) => {
  const [accessories, setAccessories] = useState([]);
  const [categories] = useState(['Tous', 'Coques', 'Écouteurs', 'Chargeurs', 'Protections écran', 'Supports']);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [sortOption, setSortOption] = useState('Prix croissant');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAccessories();
  }, [selectedCategory]);

  const loadAccessories = async () => {
    setIsLoading(true);
    try {
      let data = selectedCategory === 'Tous'
        ? await apiService.getAccessories()
        : await apiService.getAccessoriesByCategory(selectedCategory);
      sortAccessories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchAccessories = async (query) => {
    setIsLoading(true);
    try {
      let data = query ? await apiService.searchAccessories(query) : await apiService.getAccessories();
      sortAccessories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortAccessories = (data) => {
    let sorted = [...data];
    if (sortOption === 'Prix croissant') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'Prix décroissant') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'Popularité') {
      sorted.sort((a, b) => b.popularity - a.popularity);
    }
    setAccessories(sorted);
  };

  useEffect(() => {
    sortAccessories(accessories);
  }, [sortOption]);

  return (
    <View style={styles.container}>
      <SearchBar onSearch={searchAccessories} />
      <View style={styles.filters}>
        {categories.map(category => (
          <Chip
            key={category}
            title={category}
            type={selectedCategory === category ? 'solid' : 'outline'}
            onPress={() => setSelectedCategory(category)}
            containerStyle={styles.chip}
          />
        ))}
      </View>
      <View style={styles.sort}>
        <Text>Trier par:</Text>
        <Picker
          selectedValue={sortOption}
          style={styles.picker}
          onValueChange={(value) => setSortOption(value)}
        >
          <Picker.Item label="Prix croissant" value="Prix croissant" />
          <Picker.Item label="Prix décroissant" value="Prix décroissant" />
          <Picker.Item label="Popularité" value="Popularité" />
        </Picker>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : accessories.length === 0 ? (
        <Text style={styles.empty}>Aucun accessoire trouvé</Text>
      ) : (
        <FlatList
          data={accessories}
          renderItem={({ item }) => <AccessoryCard accessory={item} />}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  filters: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  chip: { margin: 4 },
  sort: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  picker: { flex: 1 },
  list: { padding: 8 },
  empty: { textAlign: 'center', marginTop: 20 },
});

export default HomeScreen;
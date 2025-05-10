import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher des accessoires..."
        onSubmitEditing={handleSearch}
      />
      {query.length > 0 && (
        <Icon
          name="clear"
          size={20}
          onPress={() => {
            setQuery('');
            onSearch('');
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8, margin: 8 },
  input: { flex: 1, fontSize: 16 },
});

export default SearchBar;
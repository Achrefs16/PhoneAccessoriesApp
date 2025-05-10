import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Button, Avatar } from 'react-native-elements';
import { saveProfile, loadProfile } from '../utils/storage';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProfile().then(profile => {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
    });
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Veuillez entrer votre nom';
    if (!email) newErrors.email = 'Veuillez entrer votre email';
    else if (!email.includes('@')) newErrors.email = 'Email invalide';
    if (!phone) newErrors.phone = 'Veuillez entrer votre numéro de téléphone';
    if (!address) newErrors.address = 'Veuillez entrer votre adresse';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveUserProfile = async () => {
    if (validate()) {
      await saveProfile({ name, email, phone, address });
      Alert.alert('Succès', 'Profil enregistré');
    }
  };

  return (
    <View style={styles.container}>
      <Avatar
        rounded
        icon={{ name: 'person' }}
        size="large"
        containerStyle={styles.avatar}
      />
      <TextInput
        style={[styles.input, errors.name && styles.error]}
        placeholder="Nom complet"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      <TextInput
        style={[styles.input, errors.email && styles.error]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        style={[styles.input, errors.phone && styles.error]}
        placeholder="Téléphone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
      <TextInput
        style={[styles.input, errors.address && styles.error, { height: 80 }]}
        placeholder="Adresse"
        value={address}
        onChangeText={setAddress}
        multiline
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
      <Button
        title="Enregistrer"
        onPress={saveUserProfile}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  avatar: { alignSelf: 'center', marginVertical: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 8, borderRadius: 4 },
  error: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12 },
  button: { backgroundColor: '#007AFF', marginTop: 16 },
});

export default ProfileScreen;
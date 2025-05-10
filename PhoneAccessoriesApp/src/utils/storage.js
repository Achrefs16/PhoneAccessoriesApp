import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveProfile = async (profile) => {
  try {
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

export const loadProfile = async () => {
  try {
    const profile = await AsyncStorage.getItem('profile');
    return profile ? JSON.parse(profile) : {};
  } catch (error) {
    console.error('Error loading profile:', error);
    return {};
  }
};

import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // Update to your deployed backend URL

export const apiService = {
  async getAccessories() {
    try {
      const response = await axios.get(`${BASE_URL}/accessories`);
      return response.data;
    } catch (error) {
      throw new Error('Échec du chargement des accessoires');
    }
  },

  async getAccessoriesByCategory(category) {
    try {
      const response = await axios.get(`${BASE_URL}/accessories/category/${category}`);
      return response.data;
    } catch (error) {
      throw new Error('Échec du chargement des accessoires par catégorie');
    }
  },

  async searchAccessories(query) {
    try {
      const response = await axios.get(`${BASE_URL}/accessories/search?q=${query}`);
      return response.data;
    } catch (error) {
      throw new Error('Échec de la recherche');
    }
  },

  async placeOrder(items, address) {
    try {
      const response = await axios.post(`${BASE_URL}/orders`, { items, address });
      return response.data;
    } catch (error) {
      throw new Error('Échec de la commande');
    }
  },

  async getOrderHistory() {
    try {
      const response = await axios.get(`${BASE_URL}/orders/history`);
      return response.data;
    } catch (error) {
      throw new Error('Échec de récupération de l\'historique');
    }
  },
};

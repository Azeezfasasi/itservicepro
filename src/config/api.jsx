import axios from 'axios';

export const API_BASE_URL = "https://itservicepro-backend.onrender.com/api";


export const getProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`);
  console.log('Fetched products:', response.data);
  return response.data;
};
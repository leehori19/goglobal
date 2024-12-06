const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env

const BASE_URL = 'https://api.commerce.coinbase.com';
const API_KEY = process.env.COINBASE_COMMERCE_API_KEY;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-CC-Api-Key': API_KEY,
    'X-CC-Version': '2018-03-22', // Specify API version
    'Content-Type': 'application/json',
  },
});

// Create a new charge
const createCharge = async (chargeData) => {
  try {
    const response = await axiosInstance.post('/charges', chargeData);
    console.log('Charge created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating charge:', error.response?.data || error.message);
  }
};

// Export functions for use in your app
module.exports = {
  createCharge,
};

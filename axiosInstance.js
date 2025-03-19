const axios = require('axios');

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:1880/',
  headers: {
    'Content-Type': 'application/json',
  }
});

module.exports = axiosInstance;

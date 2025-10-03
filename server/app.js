const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const productsFilePath = path.join(__dirname, 'data', 'products.json');
const loadProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};

const fetchGoldPrice = async () => {
  try {
    const apiKey = process.env.GOLDAPI_KEY;
    if (!apiKey) {
      throw new Error('GOLDAPI_KEY is not set');
    }

    const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    const data = response.data || {};
    const pricePerGram24k = data.price_gram_24k;
    const pricePerOunce = data.price;

    if (typeof pricePerGram24k === 'number' && isFinite(pricePerGram24k)) {
      return pricePerGram24k;
    }

    if (typeof pricePerOunce === 'number' && isFinite(pricePerOunce)) {
      const TROY_OUNCE_TO_GRAM = 31.1034768;
      return pricePerOunce / TROY_OUNCE_TO_GRAM;
    }

    throw new Error('Unexpected GoldAPI response shape');
  } catch (error) {
    console.error('Error fetching gold price from GoldAPI:', error.message || error);
    return 65.5;
  }
};

const calculatePrice = (popularityScore, weight, goldPrice) => {
  return (popularityScore + 1) * weight * goldPrice;
};

const convertToStarRating = (popularityScore) => {
  return Math.round((popularityScore * 5) * 10) / 10;
};

app.get('/api/products', async (req, res) => {
  try {
    const products = loadProducts();
    const goldPrice = await fetchGoldPrice();

    const minPrice = req.query.minPrice !== undefined ? parseFloat(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice !== undefined ? parseFloat(req.query.maxPrice) : undefined;
    const minPopularity = req.query.minPopularity !== undefined ? parseFloat(req.query.minPopularity) : undefined;
    const maxPopularity = req.query.maxPopularity !== undefined ? parseFloat(req.query.maxPopularity) : undefined;

    const processedProducts = products.map(product => {
      const price = calculatePrice(product.popularityScore, product.weight, goldPrice);
      const starRating = convertToStarRating(product.popularityScore);

      return {
        ...product,
        price: Math.round(price * 100) / 100,
        starRating,
        goldPrice
      };
    });

    const filteredProducts = processedProducts.filter(p => {
      if (minPrice !== undefined && !(typeof p.price === 'number' && p.price >= minPrice)) return false;
      if (maxPrice !== undefined && !(typeof p.price === 'number' && p.price <= maxPrice)) return false;
      if (minPopularity !== undefined && !(typeof p.popularityScore === 'number' && p.popularityScore >= minPopularity)) return false;
      if (maxPopularity !== undefined && !(typeof p.popularityScore === 'number' && p.popularityScore <= maxPopularity)) return false;
      return true;
    });

    res.json({
      success: true,
      data: filteredProducts,
      goldPrice,
      count: filteredProducts.length,
      filters: { minPrice, maxPrice, minPopularity, maxPopularity }
    });
  } catch (error) {
    console.error('Error processing products:', error);
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const products = loadProducts();
    const productIndex = parseInt(req.params.id);

    if (productIndex < 0 || productIndex >= products.length) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const goldPrice = await fetchGoldPrice();
    const product = products[productIndex];
    const price = calculatePrice(product.popularityScore, product.weight, goldPrice);
    const starRating = convertToStarRating(product.popularityScore);

    res.json({
      success: true,
      data: { ...product, price: Math.round(price * 100) / 100, starRating, goldPrice }
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
  }
});

app.get('/api/gold-price', async (req, res) => {
  try {
    const goldPrice = await fetchGoldPrice();
    res.json({ success: true, goldPrice, currency: 'USD', unit: 'per gram' });
  } catch (error) {
    console.error('Error fetching gold price:', error);
    res.status(500).json({ success: false, message: 'Error fetching gold price', error: error.message });
  }
});

module.exports = app;

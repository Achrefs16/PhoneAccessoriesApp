const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests from Flutter app
app.use(bodyParser.json()); // Parse JSON request bodies

// MongoDB Connection
mongoose.connect('mongodb+srv://achrefs430:wnNkzh568gMs2nI2@cluster0.dhbydg3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/phone_accessories')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Accessory Schema
const accessorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  popularity: { type: Number, required: true },
  category: { type: String, required: true },
});

const Accessory = mongoose.model('Accessory', accessorySchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  items: [{
    accessory: {
      id: Number,
      name: String,
      price: Number,
      image: String,
    },
    quantity: Number,
  }],
  status: { type: String, default: 'En attente' },
  date: { type: Date, default: Date.now },
  total: { type: Number, required: true },
  address: { type: String, required: true },
});

const Order = mongoose.model('Order', orderSchema);

// Helper: Generate unique order ID
const generateOrderId = () => {
  return 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// API Endpoints

// GET /accessories - Fetch all accessories
app.get('/accessories', async (req, res) => {
  try {
    const accessories = await Accessory.find();
   
    
    res.json(accessories);
  } catch (err) {
    res.status(500).json({ error: 'Échec du chargement des accessoires' });
  }
});

// GET /accessories/category/:category - Fetch accessories by category
app.get('/accessories/category/:category', async (req, res) => {
  try {
    const accessories = await Accessory.find({ category: req.params.category });
    res.json(accessories);
  } catch (err) {
    res.status(500).json({ error: 'Échec du chargement des accessoires par catégorie' });
  }
});

// GET /accessories/search - Search accessories by query
app.get('/accessories/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const accessories = await Accessory.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
      ],
    });
    res.json(accessories);
  } catch (err) {
    res.status(500).json({ error: 'Échec de la recherche' });
  }
});

// POST /orders - Place a new order
app.post('/orders', async (req, res) => {
  try {
    const { items, address } = req.body;
    const total = items.reduce((sum, item) => sum + item.accessory.price * item.quantity, 0);
    
    const order = new Order({
      id: generateOrderId(),
      items,
      address,
      total,
    });
    
    await order.save();
    res.status(201).json({ orderId: order.id, status: order.status });
  } catch (err) {
    res.status(500).json({ error: 'Échec de la commande' });
  }
});

// GET /orders/history - Fetch order history
app.get('/orders/history', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Échec de récupération de l\'historique' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
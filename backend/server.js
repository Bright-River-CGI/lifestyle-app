require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
// cors
const cors = require('cors');
app.use(cors());

mongoose.connect('mongodb+srv://TommyBR:<password>>@rdlifestyles.9xkbl.mongodb.net/lifestyle-app?retryWrites=true&w=majority&appName=rdlifestyles', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = db;

const orderSchema = new mongoose.Schema({
  title: String,
  brief: String,
  status: String,
  products: Array,
  props: Array,
  files: Array,
  createdAt: Date,
  updatedAt: Date,
});

const Order = mongoose.model('Order', orderSchema);

app.get('/orders', async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.post('/orders', async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.status(201).json(newOrder);
});

app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
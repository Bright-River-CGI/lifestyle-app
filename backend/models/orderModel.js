const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  orderfileId: String,
  text: String,
  author: String,
  date: String,
});

const fileSchema = new mongoose.Schema({
  name: String,
  size: Number,
  type: String,
  url: String,
  uploadedAt: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'] },
  comments: [commentSchema],
});

const productSchema = new mongoose.Schema({
  name: String,
  modelUrl: String,
  thumbnail: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'] },
});

const orderSchema = new mongoose.Schema({
  title: String,
  brief: String,
  status: { type: String, enum: ['draft', 'submitted', 'in-progress', 'completed'] },
  products: [productSchema],
  files: [fileSchema],
  createdAt: Date,
  updatedAt: Date,
});

const Order = mongoose.model('Order', orderSchema);
const Product = mongoose.model('Product', productSchema);
const File = mongoose.model('File', fileSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Order, Product, File, Comment };
const { Order } = require('../models/orderModel');

async function createOrder(orderData) {
  const order = new Order(orderData);
  await order.save();
  return order;
}

async function getOrders() {
  return await Order.find();
}

async function updateOrder(id, updateData) {
  return await Order.findByIdAndUpdate(id, updateData, { new: true });
}

async function deleteOrder(id) {
  return await Order.findByIdAndDelete(id);
}

module.exports = { createOrder, getOrders, updateOrder, deleteOrder };
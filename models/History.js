const mongoose = require("mongoose");
const keranjangSchema = require("./Cart");
const orderSchema = require("./Order");

const historySchema = new mongoose.Schema({
  pesanan: [keranjangSchema],
  total: {
    type: Number,
    required: true,
  },
  meja: {
    type: Number,
    required: true,
  },
  waktuPemesanan: {
    type: Date,
    default: Date.now,
  },
});

module.exports = historySchema;

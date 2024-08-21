const mongoose = require("mongoose");
const produkSchema = require("./Produk");
const pesananSchema = require("./Pesanan");

const keranjangSchema = new mongoose.Schema({
  toko: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
  },
  nama_toko: {
    type: String,
    required: true,
  },
  total_harga: {
    type: Number,
    require: true,
  },
  produk: [pesananSchema],
  status: {
    type: String,
    enum: ["diterima", "diproses", "Selesai"],
    default: "diterima",
  },
});

module.exports = keranjangSchema;

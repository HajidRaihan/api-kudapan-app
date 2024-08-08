const mongoose = require("mongoose");

const pesananSchema = new mongoose.Schema({
  nama: {
    type: String,
    // required: true,
  },
  harga: {
    type: Number,
    // required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  jumlah: {
    type: Number,
    default: 1,
    // required: true,
  },
  catatan: {
    type: String,
    default: "",
  },
  total: {
    type: Number,
    default: 0,
    // required: true,
  },
});

// const Keranjang = mongoose.model("Keranjang", keranjangSchema);

module.exports = pesananSchema;

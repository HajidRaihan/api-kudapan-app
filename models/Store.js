const mongoose = require("mongoose");
const produkSchema = require("./Produk");

const tokoSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    deskripsi: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    toko_status: {
      type: String,
      enum: ["open", "close"],
      default: "open",
    },
    produk: [{ type: mongoose.Schema.Types.ObjectId, ref: "Produk" }], // Produk di-embed di dalam Toko
  },
  { timestamps: true }
);

module.exports = tokoSchema;

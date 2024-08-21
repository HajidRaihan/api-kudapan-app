const mongoose = require("mongoose");
const pesananSchema = require("./Pesanan");

const orderSchema = new mongoose.Schema(
  {
    pemesan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    toko_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    pesanan: [pesananSchema],
    total_harga: {
      type: Number,
      required: true,
    },
    meja: {
      type: Number,
      // required: true,
    },
    waktu_pemesanan: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["menunggu", "ditolak", "diterima", "diproses", "selesai"],
      default: "menunggu",
    },
    status_pembayaran: {
      type: String,
      enum: ["lunas", "belum lunas"],
      default: "belum lunas",
    },
    jenis_layanan: {
      type: String,
      enum: ["dine in", "take away"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = orderSchema;

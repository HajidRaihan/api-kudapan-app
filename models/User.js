const mongoose = require("mongoose");
const keranjangSchema = require("./Cart");

const userSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["vendor", "customer"],
      default: "customer",
    },
    toko: { type: mongoose.Schema.Types.ObjectId, ref: "Toko" },
    status: {
      type: String,
      enum: ["aktif", "nonaktif"],
      default: "aktif",
    },
    keranjang: [keranjangSchema],
    saldo: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = userSchema;

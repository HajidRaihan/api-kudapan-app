const mongoose = require("mongoose");

const produkSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    harga: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      enum: ["makanan", "minuman"],
      default: "makanan",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = produkSchema;

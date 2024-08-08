const mongoose = require("mongoose");
const produkSchema = require("./Produk");
const keranjangSchema = require("./Cart");
const historySchema = require("./History");
const tokoSchema = require("./Store");
const userSchema = require("./User");
const orderSchema = require("./Order");
const adminSchema = require("./Admin");

const Produk = mongoose.model("Produk", produkSchema);
const Toko = mongoose.model("Toko", tokoSchema);
const Keranjang = mongoose.model("Keranjang", keranjangSchema);
const History = mongoose.model("History", historySchema);
const Order = mongoose.model("Order", orderSchema);
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);

module.exports = {
  Produk,
  Toko,
  Keranjang,
  History,
  Order,
  User,
  Admin,
};

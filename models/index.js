const mongoose = require("mongoose");
const produkSchema = require("./Produk");
const tokoSchema = require("./Store");
const userSchema = require("./User");
const orderSchema = require("./Order");
const adminSchema = require("./Admin");

const Produk = mongoose.model("Produk", produkSchema);
const Toko = mongoose.model("Toko", tokoSchema);
const Order = mongoose.model("Order", orderSchema);
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);

module.exports = {
  Produk,
  Toko,
  Order,
  User,
  Admin,
};

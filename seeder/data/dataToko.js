// const { default: mongoose } = require("mongoose");
// const dataProduk = require("./dataProduk");

// const dataToko = [
//   {
//     _id: new mongoose.Types.ObjectId(),
//     nama: "Warung Sederhana",
//     produk: dataProduk.dataProduk1.map((produk) => produk._id),
//     deskripsi: "warung nasi padang",
//     image: "1707486450080-mcd.jpg",
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     nama: "Warung Tegal",
//     produk: dataProduk.dataProduk2.map((produk) => produk._id),
//     deskripsi: "warung nasi tegal",
//     image: "1707486450080-mcd.jpg",
//   },
// ];

// module.exports = dataToko;

const mongoose = require("mongoose");
const dataProduk = require("./dataProduk");

const produkPerToko = 5;
const totalProdukDibutuhkan = 10 * produkPerToko; // 10 toko x 5 produk per toko = 50 produk
const produkTersedia = dataProduk.length;

if (produkTersedia < totalProdukDibutuhkan) {
  throw new Error("Tidak cukup produk untuk mendistribusikan ke semua toko");
}

const dataToko = Array.from({ length: 10 }).map((_, index) => ({
  _id: new mongoose.Types.ObjectId(),
  nama: `Warung ${index + 1}`,
  produk: dataProduk
    .slice(index * produkPerToko, (index + 1) * produkPerToko)
    .map((produk) => produk._id),
  deskripsi: `Deskripsi Warung ${index + 1}`,
  image: "warung.png",
}));

module.exports = dataToko;

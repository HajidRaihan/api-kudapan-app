// const mongoose = require("mongoose");

// const dataProduk1 = [
//   {
//     _id: new mongoose.Types.ObjectId(),
//     nama: "Bakso",
//     harga: 15000,
//     image: "https://example.com/bakso.jpg",
//     type: "makanan",
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     nama: "Es Teh",
//     harga: 5000,
//     image: "https://example.com/es-teh.jpg",
//     type: "minuman",
//   },
// ];

// const dataProduk2 = [
//   {
//     _id: new mongoose.Types.ObjectId(),
//     nama: "Nasi Goreng",
//     harga: 15000,
//     image: "https://example.com/bakso.jpg",
//     type: "makanan",
//   },
//   {
//     _id: new mongoose.Types.ObjectId(),
//     nama: "Es Teler",
//     harga: 5000,
//     image: "https://example.com/es-teh.jpg",
//     type: "minuman",
//   },
// ];

// module.exports = { dataProduk1, dataProduk2 };

const mongoose = require("mongoose");

const produkTemplate = [
  { nama: "Bakso", harga: 15000, image: "bakso.jpeg", type: "makanan" },
  { nama: "Es Teh", harga: 5000, image: "es-teh.jpeg", type: "minuman" },
  {
    nama: "Nasi Goreng",
    harga: 15000,
    image: "nasi-goreng.jpeg",
    type: "makanan",
  },
  { nama: "Es Teler", harga: 5000, image: "es-teler.jpg", type: "minuman" },
  { nama: "Sate", harga: 20000, image: "sate.jpg", type: "makanan" },
];

// Menggandakan setiap produk 10 kali untuk memastikan cukup produk
const dataProduk = [];
for (let i = 0; i < 10; i++) {
  produkTemplate.forEach((produk) => {
    dataProduk.push({
      ...produk,
      _id: new mongoose.Types.ObjectId(),
      nama: `${produk.nama} ${i + 1}`, // Menambahkan indeks untuk membedakan setiap produk
    });
  });
}

module.exports = dataProduk;

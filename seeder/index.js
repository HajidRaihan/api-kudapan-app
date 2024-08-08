// const seed = require("mongoose-seed");
// const { Produk, Toko, Keranjang, Order, User } = require("../Models"); // Sesuaikan dengan path model di proyek Anda

// // Data yang akan diisi ke dalam database
// const data = [
//   {
//     model: Produk,
//     documents: [
//       { _id: "produk1", nama: "Nasi Goreng", harga: 15000 },
//       { _id: "produk2", nama: "Mie Goreng", harga: 12000 },
//     ],
//   },
//   {
//     model: Toko,
//     documents: [{ _id: "toko1", nama: "Warung Sederhana", produk: ["produk1", "produk2"] }],
//   },
//   {
//     model: Keranjang,
//     documents: [{ _id: "keranjang1", produk: ["produk1", "produk2"], jumlah: 2 }],
//   },
//   {
//     model: Order,
//     documents: [{ _id: "order1", keranjang: "keranjang1", total: 27000 }],
//   },
//   {
//     model: User,
//     documents: [
//       {
//         _id: "user1",
//         nama: "John Doe",
//         email: "john.doe@example.com",
//         password: "password123",
//         role: "vendor",
//         toko: "toko1",
//         orders: ["order1"],
//       },
//     ],
//   },
// ];

// // URL koneksi MongoDB
// const dbURI = "mongodb://127.0.0.1:27017/kudapan"; // Sesuaikan dengan URL koneksi MongoDB Anda

// // Konfigurasi seeder

// // Fungsi untuk menjalankan seeder
// seed.connect(dbURI, () => {
//   seed.loadModels([
//     "../Models", // Sesuaikan path model sesuai struktur proyek Anda
//   ]);

//   seed.clearModels();
//   seed.populateModels(data, () => {
//     seed.disconnect();
//     console.log("Seeder berhasil dijalankan!");
//   });
// });

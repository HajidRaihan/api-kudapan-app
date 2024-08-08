const { query } = require("express");
const { Toko, Produk, User, Order } = require("../models");
const fs = require("fs");
const path = require("path");

// const addProduk = async (req, res) => {
//   const { nama, harga } = req.body;
//   const { tokoId, userId } = req.params;
//   console.log(tokoId);
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "user tidak ditemukan" });
//     }
//     const toko = await Toko.findById(tokoId);
//     console.log(toko.produk);

//     if (!toko) {
//       return res.status(404).json({ error: "toko tidak ditemukan" });
//     }

//     const newProduk = new Produk({
//       nama: nama,
//       harga: harga,
//       image: req.file.filename,
//     });

//     await newProduk.save();

//     toko.produk.push(newProduk);
//     user.toko.produk.push(newProduk);

//     await toko.save();
//     await user.save();
//     return res
//       .status(201)
//       .json({ message: `produk berhasil ditambahkan di toko ${toko.nama}`, produk: newProduk });
//   } catch (error) {
//     console.error("Gagal menambahkan produk:", error);
//     return res.status(500).json({ error: "Gagal menambahkan produk" });
//   }
// };

const addProduk = async (req, res) => {
  const { nama, harga, type } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "user tidak ditemukan" });
    }

    // Pastikan user memiliki toko
    if (!user.toko) {
      return res.status(404).json({ error: "user tidak memiliki toko" });
    }

    const newProduk = new Produk({
      nama: nama,
      harga: harga,
      image: req.file.filename,
      type: type,
    });

    await newProduk.save();

    // Simpan produk di toko milik user
    const toko = await Toko.findById(user.toko);
    if (!toko) {
      return res.status(404).json({ error: "toko tidak ditemukan" });
    }

    toko.produk.push(newProduk);
    await toko.save();

    return res
      .status(201)
      .json({ message: `produk berhasil ditambahkan di toko ${toko.nama}`, produk: newProduk });
  } catch (error) {
    console.error("Gagal menambahkan produk:", error);
    return res.status(500).json({ error: "Gagal menambahkan produk" });
  }
};

const deleteProduk = async (req, res) => {
  const { userId, produkId } = req.params;

  try {
    const user = await User.findById(userId);
    const toko = await Toko.findById(user.toko);
    const produk = await Produk.findById(produkId);

    if (!user) {
      return res.status(404).json({ error: "user tidak ditemukan" });
    }

    if (!toko) {
      return res.status(404).json({ error: "toko tidak ditemukan" });
    }
    if (!produk) {
      return res.status(404).json({ error: "produk tidak ditemukan" });
    }

    const index = toko.produk.indexOf(produkId);
    if (index > -1) {
      toko.produk.splice(index, 1);
    }
    // const indexUser = user.toko.produk.indexOf(produkId);
    // if (indexUser > -1) {
    //   user.toko.produk.splice(indexUser, 1);
    // }
    // await user.save();
    if (produk.image) {
      const imagePath = path.join(__dirname, "..", "images", produk.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      } else {
        console.warn("Gambar produk tidak ditemukan:", imagePath);
      }
    }

    await Produk.findByIdAndDelete(produkId);
    await toko.save();
    return res.status(200).json({ message: "Produk di hapus" });
  } catch (error) {
    console.error("Gagal menghapus produk:", error);
    return res.status(500).json({ error: "Gagal menghapus produk" });
  }
};

// const getProduk = async (req, res) => {
//   const { tokoId } = req.params;
//   try {
//     console.log(tokoId);
//     const toko = await Toko.findById(tokoId);
//     console.log(toko);

//     if (!toko) {
//       return res.status(404).json({ error: "toko tidak ditemukan" });
//     }

//     const produk = toko;

//     res.status(200).json(produk);
//   } catch (error) {
//     console.error("Gagal mendapatkan produk:", error);
//     return res.status(500).json({ error: "Gagal mendapatkan produk" });
//   }
// };

const getProduk = async (req, res) => {
  const { tokoId } = req.params;
  const { type, search } = req.query;

  try {
    // Temukan toko berdasarkan ID
    let query = {};
    if (type) {
      query.type = type;
    }
    if (search) {
      query.nama = { $regex: search, $options: "i" }; // Menambahkan pencarian berdasarkan nama produk dengan case insensitive
    }

    const toko = await Toko.findById(tokoId).populate({
      path: "produk",
      match: query,
    });
    console.log({ toko });

    if (!toko) {
      return res.status(404).json({ error: "Toko tidak ditemukan" });
    }

    const incompleteOrder = await Order.countDocuments({
      toko_id: tokoId,
      status: { $in: ["diterima", "diproses"] },
    });

    // Ambil daftar produk dari toko
    const produk = toko.produk;
    console.log({ produk });

    res.status(200).json({
      toko: toko.nama,
      tokoId: toko._id,
      incompleteOrder: incompleteOrder,
      produk,
    });
  } catch (error) {
    console.error("Gagal mendapatkan produk:", error);
    return res.status(500).json({ error: "Gagal mendapatkan produk", error });
  }
};

const getProdukById = async (req, res) => {
  const { produkId } = req.params;
  try {
    const produk = await Produk.findById(produkId);

    if (!produk) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }
    res.status(200).json(produk);
  } catch (error) {
    console.error("Gagal mendapatkan produk:", error);
    return res.status(500).json({ error: "Gagal mendapatkan produk" });
  }
};

const editProduk = async (req, res) => {
  const { userId, produkId } = req.params;

  try {
    const user = await User.findById(userId);
    const toko = await Toko.findById(user.toko);
    const produk = await Produk.findById(produkId);

    if (!user) {
      return res.status(404).json({ error: "user tidak ditemukan" });
    }

    if (!toko) {
      return res.status(404).json({ error: "toko tidak ditemukan" });
    }
    if (!produk) {
      return res.status(404).json({ error: "produk tidak ditemukan" });
    }

    // const index = toko.produk.indexOf(produkId);
    // if (index > -1) {
    //   toko.produk.splice(index, 1);
    // }

    // const indexUser = user.toko.produk.indexOf(produkId);
    // if (indexUser > -1) {
    //   user.toko.produk.splice(indexUser, 1);
    // }
    // await user.save();
    const updatedProduk = {
      nama: req.body.nama,
      harga: req.body.harga,
      type: req.body.type,
      image: req.file ? req.file.filename : produk.image,
    };

    await toko.save();
    await Produk.findByIdAndUpdate(produkId, updatedProduk);
    return res.status(200).json({ message: "Produk berhasil di edit", data: updatedProduk });
  } catch (error) {
    console.error("Gagal edit produk:", error);
    return res.status(500).json({ message: "Gagal edit produk", error: error });
  }
};

// const getDetailTokoByUserId = async (req, res) => {
//   const { userId } = req.params;

//   const user = await User.findById(userId);

//   if (!user) {
//     return res.status(404).json({ error: "User not found" });
//   }

//   const toko = await Toko.findById(user.toko);

//   if (!toko) {
//     return res.status(404).json({ error: "Toko not found" });
//   }

//   return res.status(200).json({ toko: toko });
// };

module.exports = { addProduk, getProduk, getProdukById, deleteProduk, editProduk };

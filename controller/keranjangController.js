const { Keranjang, Produk, User, Toko } = require("../models");

// const addProdukKeranjang = async (req, res) => {
//   try {
//     const { produkId, jumlah, catatan } = req.body;
//     const { userId } = req.params;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(401).json({ msg: "User not found" });
//     }

//     const produk = await Produk.findById(produkId);
//     if (!produk) {
//       return res.status(401).json({ msg: "Produk not found" });
//     }
//     const keranjang = user.keranjang;

//     console.log("ini nama produk", produk.nama);

//     const newProduk = {
//       nama: produk.nama,
//       harga: produk.harga,
//       image: produk.image,
//       jumlah: jumlah,
//       catatan: catatan,
//       total: produk.harga * jumlah,
//     };

//     // await newProduk.save();

//     console.log({ newProduk });

//     keranjang.produk.push(newProduk);

//     await keranjang.save();
//     await user.save();

//     return res.status(201).json({ message: "Keranjang ditambahkan", keranjang });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "keranjang gagal di tambahkan" });
//   }
// };

const addProdukKeranjang = async (req, res) => {
  const { tokoId, produkId, jumlah, catatan } = req.body;
  const { userId } = req.params;

  console.log(req.body);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    const toko = await Toko.findById(tokoId);
    if (!toko) {
      return res.status(401).json({ msg: "Toko not found" });
    }

    const produk = await Produk.findById(produkId);
    if (!produk) {
      return res.status(401).json({ msg: "Produk not found" });
    }

    const produkAda = toko.produk.some((item) => item._id.equals(produkId));
    if (!produkAda) {
      return res.status(401).json({ msg: "Produk tidak ada di toko tersebut" });
    }

    const produkBaru = {
      nama: produk.nama,
      harga: produk.harga,
      image: produk.image,
      jumlah: jumlah,
      catatan: catatan,
      total: produk.harga * jumlah,
    };

    let keranjang = user.keranjang;

    // keranjang.push({
    //   toko: toko._id,
    //   nama_toko: toko.nama,
    //   produk: [produkBaru],
    //   total_harga: produkBaru.total,
    // });

    // if (!keranjang) {
    //   const newKeranjang = new Keranjang({ list: [] });
    //   await newKeranjang.save();
    //   user.keranjang = newKeranjang;
    //   await user.save();
    //   keranjang = newKeranjang;
    // }

    const tokoAda = keranjang.some((item) => item.toko.equals(tokoId));

    if (tokoAda) {
      const tokoIndex = keranjang.findIndex((item) => item.toko.equals(tokoId));
      keranjang[tokoIndex].produk.push(produkBaru);
      keranjang[tokoIndex].total_harga += produkBaru.total;
    } else {
      keranjang.push({
        toko: toko._id,
        nama_toko: toko.nama,
        produk: [produkBaru],
        total_harga: produkBaru.total,
      });
    }

    // await keranjang.save();
    await user.save();

    return res.status(201).json({ message: "Keranjang ditambahkan", keranjang });
    // return res.json({ keranjang });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "keranjang gagal di tambahkan", error: error });
  }
};

// const addProdukKeranjang = async (req, res) => {
//   const { tokoId, produkId, jumlah, catatan } = req.body;
//   const { userId } = req.params;
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(401).json({ msg: "User not found" });
//     }

//     const toko = await Toko.findById(tokoId);
//     console.log({ toko });
//     if (!toko) {
//       return res.status(401).json({ msg: "Toko not found" });
//     }

//     const produk = await Produk.findById(produkId);
//     if (!produk) {
//       return res.status(401).json({ msg: "Produk not found" });
//     }

//     const produkAda = toko.produk.some((item) => item._id.equals(produkId));

//     if (!produkAda) {
//       return res.status(401).json({ msg: "Produk tidak ada di toko tersebut" });
//     }

//     const produkBaru = {
//       nama: produk.nama,
//       harga: produk.harga,
//       image: produk.image,
//       jumlah: jumlah,
//       catatan: catatan,
//       total: produk.harga * jumlah,
//     };

//     const keranjang = user.keranjang;

//     if (keranjang === null) {
//       const newKeranjang = new Keranjang({ list: [] });
//       await newKeranjang.save();
//       user.keranjang = newKeranjang;
//       await user.save();
//     }
//     const tokoAda = keranjang.list.some((item) => item.toko.equals(tokoId));

//     if (tokoAda) {
//       const tokoIndex = keranjang.list.findIndex((item) => item.toko.equals(tokoId));
//       console.log(tokoAda.produk);
//       keranjang.list[tokoIndex].produk.push(produkBaru);
//       keranjang.list[tokoIndex].total_harga += produkBaru.total;
//       await keranjang.save();
//       await user.save();
//       return res.status(201).json({
//         message: `Keranjang di tambahkan di toko ${keranjang.list[tokoIndex].nama_toko}`,
//         keranjang,
//       });
//     } else {
//       keranjang.list.push({
//         toko: toko._id,
//         nama_toko: toko.nama,
//         produk: [produkBaru],
//         total_harga: produkBaru.total,
//       });
//       console.log({ keranjang });

//       await keranjang.save();
//       await user.save();

//       console.log(keranjang);
//       return res.status(201).json({ message: "Keranjang ditambahkan", keranjang });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: "keranjang gagal di tambahkan", error: error });
//   }
// };

const getKeranjang = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }
    const keranjang = user.keranjang;
    if (!keranjang) {
      return;
    }
    return res.status(200).json(keranjang);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "keranjang gagal di tampilkan", error: error });
  }
};

const deleteProdukKeranjang = async (req, res) => {
  const { userId, orderIndex, produkIndex } = req.params;

  try {
    const user = await User.findById(userId);
    if (!userId) {
      return res.status(401).json({ msg: "User not found" });
    }
    if (orderIndex < 0 || orderIndex >= user.keranjang.length) {
      return res.status(404).json({ error: "Invalid order index" });
    }
    const order = user.keranjang[orderIndex];

    if (produkIndex < 0 || produkIndex >= order.produk.length) {
      return res.status(404).json({ error: "Invalid produk index" });
    }

    // order.produk.splice(produkIndex, 1);
    order.total_harga -= order.produk[produkIndex].harga;
    order.produk[produkIndex].jumlah -= 1;
    order.produk[produkIndex].total -= order.produk[produkIndex].harga;
    if (order.produk[produkIndex].jumlah === 0) {
      order.produk.splice(produkIndex, 1);
    }
    if (order.produk.length === 0) {
      user.keranjang.splice(orderIndex, 1);
    }

    await user.save();
    // console.log(order.produk[produkIndex].jumlah);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to delete product", error: error });
  }
};

const increaseProdukKeranjang = async (req, res) => {
  const { userId, orderIndex, produkIndex } = req.params;

  try {
    const user = await User.findById(userId);
    if (!userId) {
      return res.status(401).json({ msg: "User not found" });
    }
    if (orderIndex < 0 || orderIndex >= user.keranjang.length) {
      return res.status(404).json({ error: "Invalid order index" });
    }
    const order = user.keranjang[orderIndex];

    if (produkIndex < 0 || produkIndex >= order.produk.length) {
      return res.status(404).json({ error: "Invalid produk index" });
    }

    // order.produk.splice(produkIndex, 1);
    order.total_harga += order.produk[produkIndex].harga;
    order.produk[produkIndex].jumlah += 1;
    order.produk[produkIndex].total += order.produk[produkIndex].harga;

    await user.save();
    // console.log(order.produk[produkIndex].jumlah);
    return res.status(200).json({ message: "Product increased successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to increase product", error: error });
  }
};

const clearKeranjang = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!userId) {
      return res.status(401).json({ msg: "User not found" });
    }
    user.keranjang = [];
    await user.save();
    return res.status(200).json({ message: "Keranjang berhasil dihapus" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Keranjang gagal di hapus", error: error });
  }
};

const getJumlahKeranjang = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const jumlahKeranjang = user.keranjang.reduce((total, order) => {
      return total + order.produk.reduce((sum, produk) => sum + produk.jumlah, 0);
    }, 0);

    return res.status(200).json({ jumlahKeranjang });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Gagal menampilkan jumlah keranjang", detail: error });
  }
};

module.exports = {
  addProdukKeranjang,
  getKeranjang,
  deleteProdukKeranjang,
  increaseProdukKeranjang,
  clearKeranjang,
  getJumlahKeranjang,
};

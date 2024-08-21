const { response } = require("express");
const { User, History, Toko, Order, Produk } = require("../models");

const addOrder = async (req, res) => {
  const { jenis_layanan } = req.body;
  const { userId, meja } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // return console.log(req.body);
    console.log({ meja });

    // return console.log(typeof meja);

    let listOrder = [];

    for (const [index, item] of user.keranjang.entries()) {
      const tokoId = item.toko;
      try {
        const vendor = await User.findOne({ toko: tokoId });
        if (!vendor) {
          return res.status(404).json({ error: "Vendor not found" });
        }

        newOrder = new Order({
          pemesan: userId,
          toko_id: tokoId,
          pesanan: user.keranjang[index].produk,
          total_harga: user.keranjang[index].total_harga,
          meja: meja === "undefined" ? 0 : Number(meja),
          jenis_layanan: jenis_layanan,
        });

        newOrder.save();
        // vendor.orders.push(newOrder);
        // vendor.saldo += user.keranjang[index].total_harga;

        listOrder.push({ tokoId: tokoId, order: newOrder });

        await vendor.save();

        console.log(newOrder);
        // return res.json({ message: "orderan berhasil ditambahkan", data: newOrder });
      } catch (error) {
        console.error("Error:", error);
      }
    }
    // return;
    const produkToMove = user.keranjang;

    // Hitung total harga dari keseluruhan produk di keranjang
    // const totalHarga = hitungTotalHarga(produkToMove);
    // const newHistory = new History({
    //   pesanan: produkToMove,
    //   total: totalHarga,
    //   meja: meja,
    //   status: "diproses",
    // });

    // const saldo = user.saldo;

    // if (saldo < totalHarga) {
    //   return res.status(400).json({ error: "Saldo tidak mencukupi" });
    // }

    // user.saldo = user.saldo - totalHarga;

    // user.order_history.push(newHistory);

    // Hapus produk dari keranjang
    user.keranjang = [];

    // Simpan perubahan ke MongoDB
    await user.save();

    return res.json({ message: "order berhasil ditambahkan", data: listOrder });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "gagal menambahkan order", error });
  }
};

const addSingleOrder = async (req, res) => {
  const { userId, meja } = req.params;
  const { tokoId, produkId, jumlah, catatan } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const toko = await Toko.findById(tokoId);

    if (!toko) {
      return res.status(404).json({ error: "Toko not found" });
    }

    const produk = await Produk.findById(produkId);

    if (!produk) {
      return res.status(404).json({ error: "Produk not found" });
    }

    const produkAda = toko.produk.some((item) => item._id.equals(produkId));
    if (!produkAda) {
      return res.status(401).json({ msg: "Produk tidak ada di toko tersebut" });
    }

    const vendor = await User.findOne({ toko: tokoId });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    const newOrder = new Order({
      pemesan: userId,
      pesanan: {
        nama: produk.nama,
        harga: produk.harga,
        image: produk.image,
        jumlah: jumlah,
        catatan: catatan,
        total: produk.harga * jumlah,
      },
      total_harga: produk.harga * jumlah,
      meja: meja,
    });

    vendor.orders.push(newOrder);
    await vendor.save();
    console.log({ vendor });
    // user.orders.push(newOrder);
    // await user.save();
    console.log(newOrder);
    return res.json({ message: "orderan berhasil ditambahkan", data: newOrder });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "gagal menambahkan order", error });
  }
};

// const addOrder = async (req, res) => {
//   // const { userId, keranjangId } = req.body;
//   const { userId, meja } = req.params;
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const keranjangLength = user.keranjang.list.length;
//     for (let i = 0; i < keranjangLength; i++) {
//       // Mendapatkan ID toko dari index saat ini
//       const tokoId = user.keranjang.list[i].toko;

//       try {
//         // Mencari toko berdasarkan ID
//         const vendor = await User.findOne({ toko: tokoId });
//         if (!vendor) {
//           // Jika vendor tidak ditemukan, lanjutkan ke index berikutnya
//           continue;
//         }
//         console.log(user.nama);

//         const newOrder = new Order({
//           pemesan: user.nama,
//           email_pemesan: user.email,
//           pesanan: vendor.keranjang,
//           total_harga: 10,
//           meja: meja,
//         });
//         vendor.orders.push(newOrder);

//         // Lakukan sesuatu dengan vendor yang ditemukan
//         console.log(newOrder);

//         // await vendor.save();
//         // Anda dapat menambahkan logika lain di sini

//         // Jika Anda hanya ingin mencari satu vendor, Anda dapat keluar dari loop
//         // break;
//       } catch (error) {
//         console.error("Error:", error);
//         // Anda dapat menambahkan penanganan kesalahan sesuai kebutuhan
//       }
//     }
//     return;

//     const produkToMove = user.keranjang;

//     // Hitung total harga dari keseluruhan produk di keranjang
//     const totalHarga = hitungTotalHarga(produkToMove.list);
//     const newHistory = new History({
//       pesanan: produkToMove,
//       total: totalHarga,
//       meja: meja,
//       status: "diproses",
//     });

//     user.order_history.push(newHistory);

//     // Hapus produk dari keranjang
//     user.keranjang.list = [];

//     // Simpan perubahan ke MongoDB
//     await user.save();

//     return res.json({ message: "History berhasil ditambahkan", data: newOrder });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "gagal menambahkan order", error });
//   }
// };

const hitungTotalHarga = (produkArray) => {
  return produkArray.reduce((total, produk) => {
    return total + produk.total_harga;
  }, 0);
};

// const getOrderUser = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findById(userId);

//     if (!userId) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const order = user.orders;

//     return res.json(order);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "gagal menampilkan order", error });
//   }
// };

// const getOrderUser = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const order = await Order.find({ toko_id: user.toko });

//     const userPemesan = await User.findById(order.pemesan);
//     console.log({ userPemesan });

//     console.log(order);
//     return res.status(200).json({ message: "order berhasil ditdapatkan", data: order });
//   } catch (err) {
//     return res.status(500).json({ error: "gagal menampilkan order", error: err });
//   }
// };

// const getOrderUser = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const orders = await Order.find({ toko_id: user.toko });

//     // Array to hold orders with userPemesan
//     const ordersWithUserPemesan = [];

//     for (const order of orders) {
//       const user_pemesan = await User.findById(order.pemesan);
//       ordersWithUserPemesan.push({ ...order.toObject(), user_pemesan });
//     }

//     // console.log(ordersWithUserPemesan);
//     return res
//       .status(200)
//       .json({ message: "Order berhasil didapatkan", data: ordersWithUserPemesan });
//   } catch (err) {
//     return res.status(500).json({ error: "Gagal menampilkan order", error: err });
//   }
// };

// const getOrderUser = async (req, res) => {
//   const { userId } = req.params;
//   const { startDate, endDate } = req.query;

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Construct the date range filter if dates are provided
//     const dateFilter = {};
//     if (startDate) {
//       dateFilter.$gte = new Date(startDate);
//     }
//     if (endDate) {
//       dateFilter.$lte = new Date(endDate);
//     }

//     const filter = { toko_id: user.toko };
//     if (startDate || endDate) {
//       filter.waktu_pemesanan = dateFilter;
//     }

//     // Find orders by toko_id and filter by date range
//     const orders = await Order.find(filter);

//     // Array to hold orders with userPemesan
//     const ordersWithUserPemesan = [];

//     for (const order of orders) {
//       const user_pemesan = await User.findById(order.pemesan);
//       ordersWithUserPemesan.push({ ...order.toObject(), user_pemesan });
//     }

//     return res
//       .status(200)
//       .json({ message: "Order berhasil didapatkan aksjdhkj", data: ordersWithUserPemesan });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: "Gagal menampilkan order", detail: err });
//   }
// };

const getOrderUser = async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate, page = 1, limit = 3 } = req.query;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const dateFilter = {};

    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }

    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    const filter = { toko_id: user.toko };

    if (startDate || endDate) {
      filter.waktu_pemesanan = dateFilter;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const ordersWithUserPemesan = [];

    for (const order of orders) {
      const user_pemesan = await User.findById(order.pemesan);
      ordersWithUserPemesan.push({ ...order.toObject(), user_pemesan });
    }

    console.log({
      message: "Order berhasil didapatkan",
      data: ordersWithUserPemesan,
      hasMore: orders.length === parseInt(limit), // Untuk menunjukkan apakah masih ada order yang perlu dimuat
    });

    return res.status(200).json({
      message: "Order berhasil didapatkan",
      data: ordersWithUserPemesan,
      hasMore: orders.length === parseInt(limit), // Untuk menunjukkan apakah masih ada order yang perlu dimuat
    });
  } catch (err) {
    console.log(err);
  }
};

const getOrderUserToday = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set waktu ke awal hari
    const endOfDay = new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1); // Set waktu ke akhir hari

    const filter = {
      toko_id: user.toko,
      createdAt: {
        $gte: today,
        $lte: endOfDay,
      },
    };

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    const ordersWithUserPemesan = await Promise.all(
      orders.map(async (order) => {
        const user_pemesan = await User.findById(order.pemesan);
        return { ...order.toObject(), user_pemesan };
      })
    );

    console.log({
      message: "Order berhasil didapatkan",
      data: ordersWithUserPemesan,
    });

    return res.status(200).json({
      message: "Order berhasil didapatkan",
      data: ordersWithUserPemesan,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const detailOrder = await Order.findById(id);

    // Array to hold orders with userPemesan

    const user_pemesan = await User.findById(detailOrder.pemesan);
    const response = { ...detailOrder.toObject(), user_pemesan };
    return res.status(200).json({ message: "Order berhasil didapatkan", data: response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Gagal menampilkan order", error: err });
  }
};

// const getOrderById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     return res.status(200).json({ message: "Order found", data: order });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Failed to get order", error });
//   }
// };

// const changeStatusOrder = async (req, res) => {
//   const { userId, orderId } = req.params;
//   const { status } = req.body;

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const index = user.orders.findIndex((order) => order._id.toString() === orderId);

//     if (index === -1) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     const order = user.orders[index];

//     console.log(order);

//     order.status = status;

//     const pemesan = await User.find({ email: order.email_pemesan });

//     await user.save();

//     return res.json({ message: "Status order updated successfully", data: user.orders[index] });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Failed to update order status", error });
//   }
// };

const changeStatusOrder = async (req, res) => {
  const { userId, orderId } = req.params;
  const { status } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const order = await Order.findById(orderId);

    // return console.log(order);

    order.status = status;

    await order.save();

    return res.json({ message: "Status order updated successfully", data: order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to update order status", error });
  }
};

const orderPayment = async (req, res) => {
  const { userId, orderId } = req.params;
  const { nominal } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const vendor = await User.findOne({ toko: order.toko_id });

    if (order.total_harga > nominal) {
      return res.status(400).json({ error: "Nominal kurang" });
    }

    vendor.saldo += nominal;

    // return console.log({ nominal });

    console.log(user.saldo, parseInt(nominal));

    if (user.saldo < parseInt(nominal)) {
      return res.status(400).json({ error: "Saldo kurang" });
    }
    user.saldo = user.saldo - parseInt(nominal);

    order.status_pembayaran = "lunas";
    await order.save();
    await user.save();
    await vendor.save();

    return res.json({ message: "berhasil membayar", data: order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to pay", error });
  }
};

const paymentCashContoller = async (req, res) => {
  const { userId, orderId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status_pembayaran = "lunas";

    await order.save();

    return res.json({ message: "berhasil membayar", data: order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to pay", error });
  }
};

module.exports = {
  addOrder,
  getOrderUser,
  addSingleOrder,
  changeStatusOrder,
  getOrderById,
  orderPayment,
  paymentCashContoller,
  getOrderUserToday,
};

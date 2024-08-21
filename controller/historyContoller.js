const { User, Order, Toko } = require("../models");

// const getHistory = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const history = user.order_history;

//     return res.json(history);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "gagal menampilkan history", error });
//   }
// };

// const getHistory = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const history = await Order.find({ pemesan: userId });

//     const toko = await Toko.findById(history.toko_id);

//     console.log(history);

//     return res.status(200).json({ message: "history berhasil di dapatkan", data: history });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "gagal menenerima history", error });
//   }
// };

// const getHistory = async (req, res) => {
//   const { userId } = req.params;
//   const { status } = req.query;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     // const status = "diproses";

//     const query = { pemesan: userId };
//     if (status) {
//       query.status = status;
//     }

//     const history = await Order.find(query);

//     // Membuat array untuk menampung hasil penambahan nama toko
//     const enhancedHistory = await Promise.all(
//       history.map(async (order) => {
//         const toko = await Toko.findById(order.toko_id);
//         // console.log(toko);
//         // Menambahkan nama toko ke dalam objek pesanan
//         return { ...order.toObject(), nama_toko: toko.nama };
//       })
//     );

//     console.log(enhancedHistory);

//     return res
//       .status(200)
//       .json({ message: "history berhasil di dapatkan bla bla", data: enhancedHistory });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "gagal menenerima history", error });
//   }
// };

const getHistory = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;
  const page = parseInt(req.query.page, 10) || 1; // Default ke halaman 1 jika tidak disediakan
  const limit = 3; // Default ke 3 item per halaman

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const query = { pemesan: userId };
    if (status) {
      query.status = status;
    }

    // Mendapatkan total jumlah item yang sesuai dengan query
    const totalItems = await Order.countDocuments(query);

    // Mengambil data dengan pagination dan sorting dari terbaru ke terlama
    const history = await Order.find(query)
      .sort({ createdAt: -1 }) // Sorting berdasarkan createdAt, -1 untuk descending (terbaru ke terlama)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    // Membuat array untuk menampung hasil penambahan nama toko
    const enhancedHistory = await Promise.all(
      history.map(async (order) => {
        const toko = await Toko.findById(order.toko_id);
        return { ...order.toObject(), nama_toko: toko.nama };
      })
    );

    console.log({
      message: "History berhasil didapatkan",
      data: enhancedHistory,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });

    return res.status(200).json({
      message: "History berhasil didapatkan",
      data: enhancedHistory,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Gagal menerima history", error });
  }
};

const deleteHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.order_history = [];

    await user.save();

    return res.status(200).json({ message: "sukses menghapus history" });
  } catch (error) {
    return res.status(500).json({ error: "gagal menghapus history", error });
  }
};

module.exports = { getHistory, deleteHistory };

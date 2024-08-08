const { Toko, User, Produk, Order } = require("../models");

// const getAllStore = async (req, res) => {
//   const { search } = req.query;
//   try {
//     let toko;
//     console.log({ search });
//     if (search) {
//       // Search for a store by name or location
//       toko = await Toko.find({
//         $or: [{ nama: { $regex: search, $options: "i" } }],
//       });
//     } else {
//       toko = await Toko.find();
//     }

//     const incompleteOrdersCount = await Order.countDocuments({
//       toko_id: tokoId,
//       status: "not completed",
//     });

//     res.json(toko);
//   } catch (error) {
//     console.error("Gagal mendapatkan toko:", error);
//     res.status(500).json({ error: "Gagal mendapatkan toko" });
//   }
// };

//! getAll Store Old ---------------------
// const getAllStore = async (req, res) => {
//   const { search } = req.query;
//   try {
//     let toko;
//     console.log({ search });
//     if (search) {
//       // Search for a store by name or location

//       toko = await Toko.find({
//         $or: [{ nama: { $regex: search, $options: "i" } }],
//       });
//     } else {
//       toko = await Toko.find();
//     }

//     // For each store, count the number of incomplete orders
//     const tokoWithIncompleteOrdersCount = await Promise.all(
//       toko.map(async (store) => {
//         const incompleteOrdersCount = await Order.countDocuments({
//           toko_id: store._id,
//           status: { $in: ["diterima", "diproses"] },
//         });
//         return { ...store.toObject(), incompleteOrdersCount };
//       })
//     );

//     res.json(tokoWithIncompleteOrdersCount);
//   } catch (error) {
//     console.error("Gagal mendapatkan toko:", error);
//     res.status(500).json({ error: "Gagal mendapatkan toko" });
//   }
// };

const getAllStore = async (req, res) => {
  const { search } = req.query;
  try {
    console.log({ search });

    // Lookup user details from the users collection
    const lookupStage = {
      $lookup: {
        from: "users", // Nama koleksi users
        localField: "_id", // Field di Toko yang direferensikan oleh field toko di User
        foreignField: "toko", // Field di User yang mereferensikan Toko _id
        as: "userDetails",
      },
    };

    // Unwind the userDetails array
    const unwindStage = {
      $unwind: "$userDetails",
    };

    // Match stores where the user status is not "nonaktif"
    const matchStage = {
      $match: {
        "userDetails.status": { $ne: "nonaktif" }, // Hanya menyertakan toko dengan pengguna aktif
      },
    };

    // Optional search filter by store name
    const searchStage = search
      ? {
          $match: {
            nama: { $regex: search, $options: "i" },
          },
        }
      : {};

    // Project necessary fields and lookup incomplete orders
    const projectStage = {
      $project: {
        _id: 1,
        nama: 1,
        deskripsi: 1,
        toko_status: 1,
        image: 1,
        // Project field tambahan yang diperlukan dari koleksi Toko
      },
    };

    // Pipeline agregasi
    const pipeline = [lookupStage, unwindStage, matchStage];
    if (search) pipeline.push(searchStage);
    pipeline.push(projectStage);

    // Eksekusi pipeline agregasi
    let toko = await Toko.aggregate(pipeline);

    // Tambahkan hitungan pesanan tidak selesai
    toko = await Promise.all(
      toko.map(async (store) => {
        const incompleteOrdersCount = await Order.countDocuments({
          toko_id: store._id,
          status: { $in: ["diterima", "diproses"] },
        });
        return { ...store, incompleteOrdersCount };
      })
    );

    res.json(toko);
  } catch (error) {
    console.error("Gagal mendapatkan toko:", error);
    res.status(500).json({ error: "Gagal mendapatkan toko" });
  }
};

const addStore = async (req, res) => {
  const { nama, deskripsi } = req.body;
  const { userId } = req.params;

  try {
    // Temukan pengguna berdasarkan ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Pengguna tidak ditemukan", id: userId });
    }

    // Buat toko baru
    const newToko = new Toko({
      nama: nama,
      deskripsi: deskripsi,
      image: req.file.filename,
      // produk: [],
    });

    // Simpan toko ke dalam database
    await newToko.save();

    console.log(newToko._id);

    // Tambahkan referensi toko ke pengguna
    user.toko = newToko._id;

    console.log({ user });

    // Simpan perubahan pada pengguna
    await user.save();

    return res.status(201).json({ message: "Toko berhasil ditambahkan", toko: newToko });
  } catch (error) {
    console.error("Gagal menambahkan toko:", error);
    return res.status(500).json({ error: "Gagal menambahkan toko" });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user || !user.toko) {
      return res.status(404).json({ error: "User atau toko tidak ditemukan" });
    }

    const toko = await Toko.findById(user.toko).populate({ path: "produk" });

    // const tokoWithIncompleteOrdersCount = await Order.countDocuments({
    //   status: { $ne: "selesai" },
    // });

    // console.log({ tokoWithIncompleteOrdersCount });

    return res.status(200).json(toko);
    // return res.json({ toko: toko });
  } catch (error) {
    console.log("Error getting store data : ", error);
    return res.status(500).json({ error: "Server Error", error });
  }
};

// const updateStore = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     let { nama, deskripsi, image } = req.body;

//     // Cari user berdasarkan id yang diberikan
//     const user = await User.findById(userId);

//     // Jika user tidak ditemukan, kembalikan respon 404
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Jika ada gambar baru yang akan diupload, hapus gambar lama dan simpan gambar baru
//     if (image !== undefined) {
//       // Hapus gambar lama jika ada
//       if (user.toko && user.toko.image) {
//         await cloudinary.v2.uploader.destroy(user.toko.image);
//       }
//       // Upload gambar baru ke Cloudinary dan simpan hasilnya ke field `image` pada document user
//       image = await uploadImageToCloudinary(image);
//     } else {
//       // Jika tidak ada gambar baru, gunakan gambar lama
//       user.toko.image = image;
//     }
//     // Update informasi tentang toko
//     user.toko.nama = nama;
//     user.toko.deskripsi = deskripsi;

//     // Simpan perubahan ke database
//     user = await user.save();

//     // Kembalikan response dengan data user yang telah disimpankan
//     return res.json({ toko: user.toko });
//   } catch (err) {
//     console.error("Error updating store data", err);
//     return res.status(500).json({ error: "Server Error" });
//   }
// };

const updateStore = async (req, res) => {
  const { tokoId } = req.params;
  const { nama, deskripsi, image } = req.body;
  try {
    const existingStore = await Toko.findById(tokoId);
    if (!existingStore) {
      return res.status(404).json({ error: "Toko tidak ditemukan" });
    }
    existingStore.nama = nama;
    existingStore.deskripsi = deskripsi;
    // existingStore.image = req.file.filename;
    existingStore.image = req.file ? req.file.filename : existingStore.image;
    // console.log("ini", req.file.filename);

    await existingStore.save();
    return res.json({ toko: existingStore });
  } catch (error) {
    console.error("Gagal memperbarui toko:", error);
    return res.status(500).json({ error: "Gagal memperbarui toko" });
  }
};

const changeTokoStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(400).json("user not found");
    }

    const toko = await Toko.findById(user.toko);

    // return console.log(toko);

    if (!toko) {
      return res.status(400).json("toko not found");
    }

    // return console.log({ status });

    toko.toko_status = status;
    await toko.save();
    return res.status(200).json({ message: "success update toko", data: toko });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const filterToko = () => {
  const { kategory } = req.query;
};

module.exports = {
  getAllStore,
  addStore,
  updateStore,
  getStoreById,
  changeTokoStatus,
};

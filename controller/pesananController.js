const { User } = require("../models");

// const getPesananUserByToko = async (res, res) => {
//   const { tokoId } = req.params;
//   //   const user = await User.findById(tokoId);

//   const pesanan = await User.find({ toko: tokoId });

//   if (!pesanan || !pesanan.length) return res.status(404).json({ error: "Pesanan not found" });
// };

const deleteRiwayatPesanan = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.orders = [];
    await user.save();

    return res.status(200).json({ message: "sukses menghapus history" });
  } catch (error) {
    return res.status(500).json({ error: "gagal menghapus history", error });
  }
};

module.exports = { deleteRiwayatPesanan };

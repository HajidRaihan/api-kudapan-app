const { Admin } = require("../models");
const bcrypt = require("bcrypt");
const generateLogToken = require("../utils");

const registerAdmin = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat admin baru
    const newAdmin = new Admin({
      nama,
      email,
      password: hashedPassword,
    });

    // Simpan admin ke database
    await newAdmin.save();

    res.status(201).send("Admin berhasil didaftarkan");
  } catch (error) {
    res.status(500).json("Internal server error");
    console.error("Error registering admin:", error);
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ email: email });
    if (!user) {
      return res.status(404).send("Pengguna tidak ditemukan");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Password salah");
    }

    res.send({
      _id: user._id,
      nama: user.nama,
      email: user.email,
      token: generateLogToken(user),
    });
  } catch (error) {
    res.status(500).json("Internal server error");
    console.error("Error logging in user:", error);
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
};

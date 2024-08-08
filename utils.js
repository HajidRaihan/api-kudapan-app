const jwt = require("jsonwebtoken");

const generateLogToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      nama: user.nama,
      email: user.email,
      role: user.role,
      image: user.image,
      // saldo: user.saldo,
    },
    process.env.JWT_SECRET || "****",
    { expiresIn: "7d" }
  );
};

module.exports = generateLogToken;

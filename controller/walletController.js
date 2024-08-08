const { User } = require("../models");

const addBalance = async (req, res) => {
  const { userId } = req.params;
  const { saldo } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    user.saldo += saldo;

    await user.save();
    return res.json({ message: "Balance added successfully", data: user.saldo });
  } catch (error) {
    return res.status(500).json({ error: "Failed to add balance", error });
  }
};

module.exports = { addBalance };

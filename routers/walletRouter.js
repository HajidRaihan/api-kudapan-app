const express = require("express");
const router = express.Router();
const { addBalance } = require("../controller/walletController");

router.post("/add/:userId", addBalance);

module.exports = router;

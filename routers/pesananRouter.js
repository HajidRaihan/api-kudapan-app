const express = require("express");
const { deleteRiwayatPesanan } = require("../controller/pesananController");
const router = express.Router();
const { verifyUser } = require("../middleware/verifyAccessToken");

router.delete("/delete/:userId", verifyUser("vendor"), deleteRiwayatPesanan);

module.exports = router;

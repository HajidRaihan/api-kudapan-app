const express = require("express");
const router = express.Router();
const {
  addProduk,
  getProduk,
  getProdukById,
  deleteProduk,
  editProduk,
} = require("../Controller/produkController");
const upload = require("../middleware/multerMiddleware");
const { verifyUser } = require("../middleware/verifyAccessToken");

router.get("/get/:tokoId", getProduk);
router.get("/get/detail/:produkId", getProdukById);

// Vendor route
router.delete("/delete/:userId/:produkId", verifyUser("vendor"), deleteProduk);
router.post("/add/:userId", verifyUser("vendor"), upload.single("image"), addProduk);
router.put("/edit/:userId/:produkId", verifyUser("vendor"), upload.single("image"), editProduk);

module.exports = router;

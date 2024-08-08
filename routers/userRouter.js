const express = require("express");
const { loginAdmin, registerAdmin } = require("../controller/adminController");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getAllUser,
  getUserById,
  editUser,
  changeStatusUser,
} = require("../controller/userController");
const upload = require("../middleware/multerMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);
router.post("/admin/register", registerAdmin);
router.get("/get", getAllUser);
router.get("/get/:id", getUserById);
router.put("/status/:id", changeStatusUser);
router.put("/edit/:id", upload.single("image"), editUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getHistory, deleteHistory } = require("../controller/historyContoller");
const { verifyUser } = require("../middleware/verifyAccessToken");

router.get("/get/:userId", verifyUser("customer"), getHistory);
router.delete("/delete/:userId", verifyUser("customer"), deleteHistory);

module.exports = router;

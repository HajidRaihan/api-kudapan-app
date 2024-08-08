const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect("mongodb+srv://root:31072002@atlascluster.oh7ia.mongodb.net/kudapan_db")
  .then(() => console.log("database connected"))
  .catch((err) => console.log("database connecttion is error", err));

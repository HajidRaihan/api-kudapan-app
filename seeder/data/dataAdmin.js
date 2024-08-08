const bcrypt = require("bcrypt");
const dataToko = require("./dataToko");

const dataAdmin = {
  nama: "admin",
  email: "admin@gmail.com",
  password: bcrypt.hashSync("password", 10),
  role: "admin",
};

module.exports = dataAdmin;

const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const userRouter = require("./routers/userRouter");
// const tokoRouter = require("./routers/tokoRouter");
// const produkRouter = require("./routers/produkRouter");
// const keranjangRouter = require("./routers/keranjangRouter");
// const orderRouter = require("./routers/orderRouter");
// const historyRouter = require("./routers/historyRouter");
// const walletRouter = require("./routers/walletRouter");
// const pesananRouter = require("./routers/pesananRouter");
// const bodyParser = require("body-parser");

// require("./db/mongoose");
// const morgan = require("morgan");
// const { verifyUser } = require("./middleware/verifyAccessToken");

// dotenv.config();
const app = express();
// const http = require("http");
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

// // socket io setup
// // const io = require("socket.io")(8080, {
// //   cors: {
// //     origin: "*",
// //   },
// // });

// io.on("connection", (socket) => {
//   // console.log("a user connected");
//   socket.on("message", (msg) => {
//     io.emit("message", "hello juga mamakmu");
//     console.log(msg);
//   });
//   socket.on("newOrder", (data) => {
//     console.log(data);
//   });
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

// const port = process.env.PORT || 6000;

// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// app.use("/api/user", userRouter);
// app.use("/api/store", tokoRouter);
// app.use("/api/produk", produkRouter);
// app.use("/api/keranjang", keranjangRouter);
// app.use("/api/order", orderRouter);
// app.use("/api/history", historyRouter);
// app.use("/api/wallet", walletRouter);
// app.use("/api/pesanan", pesananRouter);
// app.use("/images", express.static("images"));
// // Handling all the unknown endpoints

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
// app.get("/healthceck", (req, res) => {
//   res.send("Working!");
// });
// app.use((req, res) => {
//   res.status(404).json({ message: "Endpoint not found" });
// });
// // Error handling middleware
// app.use((error, req, res, next) => {
//   res.status(500).json({ message: error.message });
//   next();
//   console.log(error);
// });

// app.listen(port, () => {
//   console.log(`server running at http://localhost:${port}`);
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(8000, () => {
  console.log(`server running at http://localhost:8000`);
});

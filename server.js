const express = require("express");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const path = require("path");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("colors");
require("dotenv").config();

const connectDB = require("./config/db");
const initSocket = require("./index");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173","http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admi.html"));
});

app.use("/api/admin", require("./routes/userRoute"));
app.use("/api/notification", require("./routes/notificationRoute"));
app.use("/api/images", require("./routes/imageRoutes"));
app.use("/api/deposits", require("./routes/depositRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/withdrawal", require("./routes/withdrawalRoute"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/referral", require("./routes/referralSettingRoutes"));
app.use("/api/game", require("./routes/allgameroute/allGameRoute"));
app.use("/api/user-deposit", require("./routes/userDepositRoutes"));
app.use("/api/wrestling", require("./routes/wrestling/wrestlingRoutes"));
app.use('/api/wrestling-bet-history',require('./routes/wrestling/wrestlingBetHistoryRoutes'))
app.use('/api/admin/wrestling-bets',require('./routes/wrestling/wrestlingBetAdminRoutes'))
const startMatchCron = require("./cron/matchAutoStart");

startMatchCron();

connectDB();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","http://localhost:5174"],
    credentials: true,
  },
});

initSocket(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`.green.bold);
});
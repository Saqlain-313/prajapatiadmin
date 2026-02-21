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
    origin: ["http://localhost:5173","http://localhost:5174","http://localhost:5176"],
    credentials: true,
  })
);
//  malikkk
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

app.use("/api", require("./routes/userRoute"));
app.use("/api", require("./routes/notificationRoute"));
app.use("/api", require("./routes/imageRoutes"));
app.use("/api", require("./routes/depositRoutes"));
app.use("/api", require("./routes/paymentRoutes"));
app.use("/api", require("./routes/withdrawalRoute"));
app.use("/api", require("./routes/productRoutes"));
app.use("/api", require("./routes/referralSettingRoutes"));
app.use("/api", require("./routes/allgameroute/allGameRoute"));
app.use("/api", require("./routes/userDepositRoutes"));
app.use("/api", require("./routes/wrestling/wrestlingRoutes"));
app.use('/api',require('./routes/wrestling/wrestlingBetHistoryRoutes'))
app.use('/api',require('./routes/wrestling/wrestlingBetAdminRoutes'))
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
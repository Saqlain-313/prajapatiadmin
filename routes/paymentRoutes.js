const express = require("express");
const protect = require("../middlewares/authMiddleware");
const { generateUpiQR } = require("../controllers/paymentController");
const router = express.Router();


router.get("/qr/:productId", protect, generateUpiQR);

module.exports = router;

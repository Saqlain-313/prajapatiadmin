const express = require("express");
const router = express.Router();

const {
  updateUserDepositStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getAllUserDeposits,
  getMyDeposits,
} = require("../controllers/userDepositController");

const  adminMiddleware  = require("../middlewares/adminMiddleware");
const protect = require("../middlewares/authMiddleware");



router.post("/order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyRazorpayPayment);
router.get("/my", protect, getMyDeposits);




router.get(
  "/admin/all",
  protect,
  adminMiddleware,
  getAllUserDeposits
);



router.put(
  "/admin/:id",
  protect,
  adminMiddleware,
  updateUserDepositStatus
);

module.exports = router;

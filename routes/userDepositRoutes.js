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



router.post("/user-deposit/order", protect, createRazorpayOrder);
router.post("/user-deposit/verify", protect, verifyRazorpayPayment);
router.get("/user-deposit/my", protect, getMyDeposits);




router.get(
  "/user-deposit/admin/all",
  protect,
  adminMiddleware,
  getAllUserDeposits
);



router.put(
  "/user-deposit/admin/:id",
  protect,
  adminMiddleware,
  updateUserDepositStatus
);

module.exports = router;

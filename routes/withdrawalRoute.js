const express = require("express");
const { createWithdrawal, getMyWithdrawals, getAllWithdrawals, approveWithdrawal, rejectWithdrawal } = require("../controllers/withdrawalController");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();



/* ======================
   USER
====================== */
router.post("/withdrawal/request", protect, createWithdrawal);
router.get("/withdrawal/my", protect, getMyWithdrawals);

/* ======================
   ADMIN
====================== */
router.get("/withdrawal/all", protect,  getAllWithdrawals);
router.put("/withdrawal/approve/:id", protect,  approveWithdrawal);
router.put("/withdrawal/reject/:id", protect,  rejectWithdrawal);

module.exports = router;

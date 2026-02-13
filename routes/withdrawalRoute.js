const express = require("express");
const { createWithdrawal, getMyWithdrawals, getAllWithdrawals, approveWithdrawal, rejectWithdrawal } = require("../controllers/withdrawalController");
const protect = require("../middlewares/authMiddleware");
const router = express.Router();



/* ======================
   USER
====================== */
router.post("/request", protect, createWithdrawal);
router.get("/my", protect, getMyWithdrawals);

/* ======================
   ADMIN
====================== */
router.get("/all", protect,  getAllWithdrawals);
router.put("/approve/:id", protect,  approveWithdrawal);
router.put("/reject/:id", protect,  rejectWithdrawal);

module.exports = router;

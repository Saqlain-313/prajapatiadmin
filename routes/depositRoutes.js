const express = require("express");
const protect = require("../middlewares/authMiddleware");
const { createDeposit, getMyDeposits, updateDepositStatus, getAllDeposits, getDeposits } = require("../controllers/depositController");
const router = express.Router();



/* USER */
// router.post("/", protect, createDeposit);
// router.get("/my", protect, getMyDeposits);

/* ADMIN */
router.get("/deposits/deposits", protect, getAllDeposits);
router.get("/deposits/getdeposits", getDeposits);
router.put("/deposits/update/:id",  updateDepositStatus);

module.exports = router;

const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const router = express.Router();

const {
  getAllWrestlingBets,
  getWrestlingBetById,
  updateWrestlingBetStatus,
} = require("../../controllers/wrestling/wrestlingBetAdminController");


router.get("/admin/wrestling-bets/all", protect,  getAllWrestlingBets);
router.get("/admin/wrestling-bets/:id", protect,  getWrestlingBetById);
router.put("/admin/wrestling-bets/settle/:id", protect,  updateWrestlingBetStatus);

module.exports = router;
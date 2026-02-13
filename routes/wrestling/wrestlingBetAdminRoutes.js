const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const router = express.Router();

const {
  getAllWrestlingBets,
  getWrestlingBetById,
  updateWrestlingBetStatus,
} = require("../../controllers/wrestling/wrestlingBetAdminController");


router.get("/all", protect,  getAllWrestlingBets);
router.get("/:id", protect,  getWrestlingBetById);
router.put("/settle/:id", protect,  updateWrestlingBetStatus);

module.exports = router;
const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const { getAllWrestlingBetHistory, getMyWrestlingBetHistory, getWrestlingBetHistoryByMid, getMatchProfitSummary } = require("../../controllers/wrestling/wrestlingBetHistoryController");
const router = express.Router();



// Admin route
router.get("/all", protect, getAllWrestlingBetHistory);

// User route

router.get("/wrestling-bets/:mid", protect, getWrestlingBetHistoryByMid);

router.get(
    "/match-profit/:mid", protect, getMatchProfitSummary);

module.exports = router;



const express = require("express");
const protect = require("../../middlewares/authMiddleware");
const { getAllWrestlingBetHistory, getMyWrestlingBetHistory, getWrestlingBetHistoryByMid, getMatchProfitSummary } = require("../../controllers/wrestling/wrestlingBetHistoryController");
const router = express.Router();



// Admin route
router.get("/wrestling-bet-history/all", protect, getAllWrestlingBetHistory);

// User route

router.get("/wrestling-bet-history/wrestling-bets/:mid", protect, getWrestlingBetHistoryByMid);

router.get(
    "/wrestling-bet-history/match-profit/:mid", protect, getMatchProfitSummary);

module.exports = router;



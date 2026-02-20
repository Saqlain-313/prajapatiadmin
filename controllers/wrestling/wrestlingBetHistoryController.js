const WrestlingBetHistory = require("../../models/WRESTLING/WrestlingBetHistory");

/* =====================================
   1️⃣ GET ALL BET HISTORY (ADMIN)
===================================== */
exports.getAllWrestlingBetHistory = async (req, res) => {
  try {
    const bets = await WrestlingBetHistory.find()
      .populate("userId") // ✅ correct field
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bets.length,
      bets,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =====================================
   2️⃣ GET LOGGED IN USER BET HISTORY
===================================== */
exports.getMyWrestlingBetHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const bets = await WrestlingBetHistory.find({ userId }) // ✅ fixed
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bets.length,
      bets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =====================================
   3️⃣ GET BET HISTORY BY MATCH ID (MID)
===================================== */
exports.getWrestlingBetHistoryByMid = async (req, res) => {
  try {
    const { mid } = req.params;

    if (!mid) {
      return res.status(400).json({
        success: false,
        message: "Match MID is required",
      });
    }

    // ✅ sid = match id in your schema
    const bets = await WrestlingBetHistory.find({ sid: mid })
      .populate("userId")
      .sort({ createdAt: -1 });

    if (!bets.length) {
      return res.status(404).json({
        success: false,
        message: "No bets found for this match",
      });
    }

    res.status(200).json({
      success: true,
      count: bets.length,
      bets,
    });

  } catch (error) {
    console.error("Error fetching match bet history:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMatchProfitSummary = async (req, res) => {
  try {
    const { mid } = req.params;

    if (!mid) {
      return res.status(400).json({
        success: false,
        message: "Match MID is required",
      });
    }

    const bets = await WrestlingBetHistory.find({ sid: mid });

    if (!bets.length) {
      return res.status(404).json({
        success: false,
        message: "No bets found for this match",
      });
    }

    const teams = {};

    // =========================
    // TEAM-WISE TOTAL COUNT
    // =========================
    bets.forEach((bet) => {
      const { teamName, otype, price, betAmount } = bet;

      if (!teams[teamName]) {
        teams[teamName] = {
          totalBackStake: 0,
          totalBackProfit: 0,
          totalLayStake: 0,
          totalLayLiability: 0,
        };
      }

      if (otype === "back") {
        teams[teamName].totalBackStake += Number(price);
        teams[teamName].totalBackProfit += Number(betAmount);
      }

      if (otype === "lay") {
        teams[teamName].totalLayStake += Number(price);
        teams[teamName].totalLayLiability += Number(betAmount);
      }
    });

    return res.status(200).json({
      success: true,
      matchId: mid,
      teamSummary: teams,
    });

  } catch (error) {
    console.error("Profit summary error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
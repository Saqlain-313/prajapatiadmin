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
    // STEP 1️⃣ TEAM-WISE COUNT
    // =========================
    bets.forEach((bet) => {
      const { teamName, otype, price, betAmount } = bet;

      if (!teams[teamName]) {
        teams[teamName] = {
          backStake: 0,
          backProfit: 0,
          layStake: 0,
          layLiability: 0,
        };
      }

      if (otype === "back") {
        teams[teamName].backStake += price;        // stake
        teams[teamName].backProfit += betAmount;  // profit if win
      }

      if (otype === "lay") {
        teams[teamName].layStake += price;        // stake user wins if team loses
        teams[teamName].layLiability += betAmount; // admin pays if team wins
      }
    });

    const teamNames = Object.keys(teams);

    if (teamNames.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Match must have exactly 2 teams",
      });
    }

    const [teamA, teamB] = teamNames;

    // =========================
    // STEP 2️⃣ SCENARIO CALCULATION
    // =========================

    const calculateAdminProfit = (team) => {
      return (
        + teams[team].backStake        // back lose stake
        - teams[team].backProfit       // pay back profit
        + teams[team].layLiability     // lay users lose liability
        - teams[team].layStake         // lay users win stake
      );
    };

    const teamAProfit = calculateAdminProfit(teamA);
    const teamBProfit = calculateAdminProfit(teamB);

    // =========================
    // STEP 3️⃣ COMPARE WHICH SIDE BETTER
    // =========================

    let bestOutcome = "";
    let bestProfit = 0;

    if (teamAProfit > teamBProfit) {
      bestOutcome = `${teamA} Wins (Admin Advantage)`;
      bestProfit = teamAProfit;
    } else if (teamBProfit > teamAProfit) {
      bestOutcome = `${teamB} Wins (Admin Advantage)`;
      bestProfit = teamBProfit;
    } else {
      bestOutcome = "Balanced Market";
      bestProfit = teamAProfit;
    }

    const result = {
      matchId: mid,
      scenarios: {
        [`${teamA}_wins`]: { adminProfit: teamAProfit },
        [`${teamB}_wins`]: { adminProfit: teamBProfit },
      },
      betterSide: bestOutcome,
      betterProfit: bestProfit,
      teamSummary: teams,
    };

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("Profit summary error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
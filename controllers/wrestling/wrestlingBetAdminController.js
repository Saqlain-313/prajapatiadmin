const WrestlingBet = require("../../models/WRESTLING/WrestlingBet");
const WrestlingBetHistory = require("../../models/WRESTLING/WrestlingBetHistory");
const User = require('../../models/usermodel')
const mongoose = require("mongoose");

/* =====================================
   1️⃣ GET ALL WRESTLING BETS
===================================== */
exports.getAllWrestlingBets = async (req, res) => {
  try {
    const bets = await WrestlingBet.find()
      .populate("userId")
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



exports.getWrestlingBetById = async (req, res) => {
  try {
    const bet = await WrestlingBet.findById(req.params.id)
      .populate("userId");

    if (!bet) {
      return res.status(404).json({
        success: false,
        message: "Bet not found",
      });
    }

    res.status(200).json({
      success: true,
      bet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.updateResultOfBets = async (req, res) => {
  const { gameType, marketName } = req.body;

  if (!gameType || !marketName) {
    return res.status(400).json({
      success: false,
      message: "gameType and marketName are required",
    });
  }

  let totalBetsProcessed = 0;

  try {
    // Fetch all pending bets
    const bets = await WrestlingBet.find({
      status: 0,
      gameType,
      marketName,
    });

    if (!bets.length) {
      return res.status(200).json({
        success: true,
        message: "No pending bets found",
        totalProcessed: 0,
      });
    }

    // Group bets by gameId
    const groupedBets = bets.reduce((acc, bet) => {
      if (!acc[bet.gameId]) acc[bet.gameId] = [];
      acc[bet.gameId].push(bet);
      return acc;
    }, {});

    for (const gameId of Object.keys(groupedBets)) {

      // ⚠️ Fetch game winner
      const game = await GameModel.findById(gameId);
      if (!game || !game.winner) continue;

      const winner = game.winner.trim().toLowerCase();

      for (const bet of groupedBets[gameId]) {
        try {
          const user = await SubAdmin.findById(bet.userId);
          if (!user) continue;

          const betTeam = bet.teamName?.trim().toLowerCase();
          const isWin = betTeam === winner;

          let resultAmount = 0;

          // ================= BACK =================
          if (bet.otype === "back") {
            if (isWin) {
              resultAmount = bet.betAmount + bet.price;
              user.credit += resultAmount;
              user.profitLoss += bet.price;
              bet.status = 1; // WIN
            } else {
              user.profitLoss -= bet.price;
              bet.status = 2; // LOSS
            }
          }

          // ================= LAY =================
          else if (bet.otype === "lay") {
            if (isWin) {
              user.profitLoss -= bet.price;
              bet.status = 2; // LOSS
            } else {
              resultAmount = bet.betAmount + bet.price;
              user.credit += resultAmount;
              user.profitLoss += bet.price;
              bet.status = 1; // WIN
            }
          }

          bet.resultAmount = resultAmount;
          bet.betResult = game.winner;

          await user.save();
          await bet.save();

          totalBetsProcessed++;

        } catch (err) {
          console.error("Bet processing error:", err);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "All bets processed successfully",
      totalProcessed: totalBetsProcessed,
    });

  } catch (error) {
    console.error("Error in updateResultOfBets:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




exports.disqualifyWrestlingBets = async (req, res) => {
  try {
    const { team, type } = req.body;

    if (!team || !type) {
      return res.status(400).json({
        success: false,
        message: "Team and type required",
      });
    }

    const pendingBets = await WrestlingBet.find({ status: 0 });

    for (const bet of pendingBets) {
      const user = await User.findById(bet.userId);
      if (!user) continue;

      let payout = 0;
      let betResult = "LOSS";

      if (bet.teamName === team && bet.otype === type) {
        payout = bet.price + bet.betAmount;

        user.credit += payout;

        bet.status = 1;
        bet.resultAmount = payout;
        betResult = "REFUND";
      } else {
        bet.status = 2;
        bet.resultAmount = 0;
      }

      await bet.save();
      await user.save();

      // 🔥 UPDATE HISTORY
      await WrestlingBetHistory.findOneAndUpdate(
        { userId: bet.userId, sid: bet.sid, gameId: bet.gameId, status: 0 },
        {
          status: bet.status,
          resultAmount: bet.resultAmount,
          betResult: betResult,
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Disqualified bets refunded & history updated",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

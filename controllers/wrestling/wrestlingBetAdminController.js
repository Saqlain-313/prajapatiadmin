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


exports.updateWrestlingBetStatus = async (req, res) => {
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

      const oppositeType = type === "back" ? "lay" : "back";

      let isWin = false;

      // Condition 1: Same Team + Same Type
      if (bet.teamName === team && bet.otype === type) {
        isWin = true;
      }

      // Condition 2: Opposite Team + Opposite Type
      if (bet.teamName !== team && bet.otype === oppositeType) {
        isWin = true;
      }

      let payout = 0;
      let betResult = "LOSS";

      if (isWin) {
        payout = bet.price + bet.betAmount;

        user.credit += payout;
        bet.status = 1;
        bet.resultAmount = payout;
        betResult = "WIN";
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
      message: "All bets settled & history updated",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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

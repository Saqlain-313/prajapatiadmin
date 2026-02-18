const WrestlingBet = require("../../models/WRESTLING/WrestlingBet");
const WrestlingBetHistory = require("../../models/WRESTLING/WrestlingBetHistory");
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


/* =====================================
   2️⃣ GET BET BY ID
===================================== */
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


/* =====================================
   3️⃣ UPDATE BET STATUS (0,1,2)
===================================== */
exports.updateWrestlingBetStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status } = req.body;


    if (![0, 1, 2].includes(status)) {
      throw new Error("Invalid status value");
    }

    const bet = await WrestlingBet.findById(req.params.id)
      .populate("userId")
      .session(session);

    if (!bet) {
      throw new Error("Bet not found");
    }

    // 🚫 prevent double settlement
    if (bet.status !== 0) {
      throw new Error("Bet already settled");
    }

    const stake = Number(bet.betAmount) || 0;
    const profit = Number(bet.resultAmount) || 0;

    /* ===============================
       STATUS LOGIC
    =============================== */

    bet.status = status;

    if (status === 1) {
      // WON
      bet.betResult = "WON";
      bet.userId.credit += profit;
    }

    if (status === 2) {
      // LOST
      bet.betResult = "LOST";
      // no credit
    }


    await bet.userId.save({ session });
    await bet.save({ session });

    /* ===============================
       UPDATE HISTORY
    =============================== */

    await WrestlingBetHistory.updateOne(
      {
        userId: bet.userId._id,
        sid: bet.sid,
        gameId: bet.gameId,
      },
      {
        status: status,
        betResult: bet.betResult,
        resultAmount: bet.resultAmount,
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Bet status updated successfully",
      bet,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
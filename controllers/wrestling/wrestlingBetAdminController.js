const WrestlingBet = require("../../models/WRESTLING/WrestlingBet");

const mongoose = require("mongoose");
const WrestlingBetHistory = require("../../models/WRESTLING/WrestlingBetHistory");
const User = require("../../models/usermodel");



exports.getAllWrestlingBets = async (req, res) => {
  try {
    const bets = await WrestlingBet.find()
      .populate("user")
      .populate("match")
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
      .populate("user")
      .populate("match");

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
   3️⃣ ADMIN SETTLE / APPROVE BET
===================================== */
exports.updateWrestlingBetStatus = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { result } = req.body; 

    if (!["WON", "LOST", "CANCELLED"].includes(result)) {
      return res.status(400).json({
        success: false,
        message: "Invalid result value",
      });
    }

    await session.withTransaction(async () => {
      const bet = await WrestlingBet.findById(req.params.id)
        .populate("user")
        .session(session);

      if (!bet) {
        throw new Error("Bet not found");
      }

      if (bet.settled) {
        throw new Error("Bet already settled");
      }
      
      bet.result = result;
      bet.settled = true;
      await bet.save({ session });

      // ✅ Credit Logic
      if (result === "WON") {
        await User.findByIdAndUpdate(
          bet.user._id,
          { $inc: { credit: bet.profit +bet.liability } },
          { session }
        );
      }

      if (result === "CANCELLED") {
        await User.findByIdAndUpdate(
          bet.user._id,
          { $inc: { credit: bet.stake } },
          { session }
        );
      }

      // ✅ Update History (No VOID mapping now)
      await WrestlingBetHistory.findOneAndUpdate(
        { 
          user: bet.user._id,
          mid: bet.mid,
          teamTid: bet.teamTid,
          boxId: bet.boxId,
          rate: bet.rate,
          stake: bet.stake,
          settled: false
        },
        {
          result: result,
          settled: true,
        },
        { session }
      );
    });

    session.endSession();

    res.status(200).json({
      success: true,
      message: "Bet & History settled successfully",
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
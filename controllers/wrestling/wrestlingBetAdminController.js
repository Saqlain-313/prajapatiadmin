const WrestlingBet = require("../../models/WRESTLING/WrestlingBet");
const WrestlingBetHistory = require('../../models/WRESTLING/WrestlingBetHistory')
const mongoose = require("mongoose");


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
  session.startTransaction();

  try {
    const { result } = req.body; // WON / LOST / CANCELLED

    // ✅ Result Validation
    if (!["WON", "LOST", "CANCELLED"].includes(result)) {
      throw new Error("Invalid result type");
    }

    const bet = await WrestlingBet.findOne({
      _id: req.params.id,
      settled: false, // 🔒 Prevent double settlement
    })
      .populate("user")
      .session(session);

    if (!bet) {
      throw new Error("Bet not found or already settled");
    }

    // 🔹 Update Bet Status
    bet.result = result;
    bet.settled = true;

    // 💰 CREDIT LOGIC
    if (result === "WON") {
      bet.user.credit += bet.profit;
    }

    if (result === "CANCELLED") {
      bet.user.credit += bet.stake;
    }

    // LOST case → nothing added (stake already deducted)

    await bet.user.save({ session });
    await bet.save({ session });

    // 🔹 Update History (Better way: use betId if possible)
    await WrestlingBetHistory.updateOne(
      { betId: bet._id }, // 👈 recommend storing betId in history
      {
        result: result === "CANCELLED" ? "VOID" : result,
        settled: true,
      },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Bet settled successfully",
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
const WrestlingBet = require("../../models/WRESTLING/WrestlingBet");
const WrestlingBetHistory = require("../../models/WRESTLING/WrestlingBetHistory");

const GameModel = require("../../models/WRESTLING/WrestlingMatch");
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
  const { eventName, winner, otype } = req.body;

  if (!eventName || !winner || !otype) {
    return res.status(400).json({
      success: false,
      message: "eventName, winner and otype are required",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const normalize = (val) =>
      val?.toString().trim().toLowerCase();

    const normalizedEvent = normalize(eventName);
    const normalizedWinner = normalize(winner);
    const normalizedOtype = normalize(otype);

    let totalProcessed = 0;

    // Get all pending bets of event
    const bets = await WrestlingBet.find({
      status: 0,
      eventName: { $regex: new RegExp(`^${normalizedEvent}$`, "i") },
    }).session(session);

    if (!bets.length) {
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "No pending bets found",
        totalProcessed: 0,
      });
    }

    for (const bet of bets) {
      const user = await User.findById(bet.userId).session(session);
      if (!user) continue;

      const betTeam = normalize(bet.teamName);
      const betOtype = normalize(bet.otype);

      let resultAmount = 0;

      // ===============================
      // 🔴 TIED MATCH SPECIAL LOGIC
      // ===============================
      if (normalizedWinner === "tied match") {

        const isExactWinner =
          betTeam === "tied match" &&
          betOtype === normalizedOtype;

        if (isExactWinner) {
          // WIN
          resultAmount = bet.betAmount + bet.price;

          await User.updateOne(
            { _id: user._id },
            {
              $inc: {
                credit: resultAmount,
                profitLoss: bet.price,
              },
            },
            { session }
          );

          bet.status = 1; // WIN
        } else {
          // LOSS
          await User.updateOne(
            { _id: user._id },
            {
              $inc: {
                profitLoss: -bet.price,
              },
            },
            { session }
          );

          bet.status = 2; // LOSS
        }
      }

      // ===============================
      // 🟢 NORMAL MATCH LOGIC
      // ===============================
      else {

        const isWin = betTeam === normalizedWinner;

        // -------- BACK --------
        if (betOtype === "back") {

          if (isWin) {
            resultAmount = bet.betAmount + bet.price;

            await User.updateOne(
              { _id: user._id },
              {
                $inc: {
                  credit: resultAmount,
                  profitLoss: bet.price,
                },
              },
              { session }
            );

            bet.status = 1; // WIN
          } else {

            await User.updateOne(
              { _id: user._id },
              {
                $inc: {
                  profitLoss: -bet.price,
                },
              },
              { session }
            );

            bet.status = 2; // LOSS
          }

        }

        // -------- LAY --------
        else if (betOtype === "lay") {

          if (isWin) {
            // LAY loses if selected team wins
            await User.updateOne(
              { _id: user._id },
              {
                $inc: {
                  profitLoss: -bet.price,
                },
              },
              { session }
            );

            bet.status = 2; // LOSS
          } else {
            // LAY wins if selected team loses
            resultAmount = bet.betAmount + bet.price;

            await User.updateOne(
              { _id: user._id },
              {
                $inc: {
                  credit: resultAmount,
                  profitLoss: bet.price,
                },
              },
              { session }
            );

            bet.status = 1; // WIN
          }
        }

      }

      bet.resultAmount = resultAmount;
      bet.betResult = winner;

      await bet.save({ session });
      totalProcessed++;
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Settlement completed successfully",
      totalProcessed,
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};





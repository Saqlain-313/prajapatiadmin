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



// exports.updateWrestlingBetStatus = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { status } = req.body;


//     if (![0, 1, 2].includes(status)) {
//       throw new Error("Invalid status value");
//     }

//     const bet = await WrestlingBet.findById(req.params.id)
//       .populate("userId")
//       .session(session);

//     if (!bet) {
//       throw new Error("Bet not found");
//     }

//     if (bet.status !== 0) {
//       throw new Error("Bet already settled");
//     }

//     const stake = Number(bet.betAmount) || 0;
//     const profit = Number(bet.resultAmount) || 0;


//     bet.status = status;

//     if (status === 1) {
//       bet.betResult = "WON";
//       bet.userId.credit += profit;
//     }

//     if (status === 2) {
//       bet.betResult = "LOST";
//     }


//     await bet.userId.save({ session });
//     await bet.save({ session });



//     await WrestlingBetHistory.updateOne(
//       {
//         userId: bet.userId._id,
//         sid: bet.sid,
//         gameId: bet.gameId,
//       },
//       {
//         status: status,
//         betResult: bet.betResult,
//         resultAmount: bet.resultAmount,
//       },
//       { session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     return res.status(200).json({
//       success: true,
//       message: "Bet status updated successfully",
//       bet,
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// exports.updateWrestlingBetStatus = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { status } = req.body;

//     if (![1, 2].includes(status)) {
//       throw new Error("Invalid status value");
//     }

//     const bet = await WrestlingBet.findById(req.params.id)
//       .populate("userId")
//       .session(session);

//     if (!bet) {
//       throw new Error("Bet not found");
//     }

//     if (bet.status !== 0) {
//       throw new Error("Bet already settled");
//     }

//     let winAmount = 0;

//     // ================= BACK =================
//     if (bet.otype === "back") {

//       if (status === 1) {
//         // BACK WIN
//         winAmount = bet.price + bet.betAmount;

//         bet.userId.credit += winAmount;
//         bet.userId.profitLoss += bet.betAmount;

//         bet.betResult = "WON";
//         bet.resultAmount = winAmount;

//       } else {
//         // BACK LOSS
//         bet.userId.profitLoss -= bet.price;

//         bet.betResult = "LOST";
//         bet.resultAmount = bet.price;
//       }

//     }

//     // ================= LAY =================
//     else if (bet.otype === "lay") {

//       if (status === 1) {
//         // LAY WIN
//         winAmount = bet.betAmount;

//         bet.userId.credit += winAmount;
//         bet.userId.profitLoss += bet.betAmount;

//         bet.betResult = "WON";
//         bet.resultAmount = winAmount;

//       } else {
//         // LAY LOSS
//         bet.userId.profitLoss -= bet.price;

//         bet.betResult = "LOST";
//         bet.resultAmount = bet.price;
//       }

//     }

//     bet.status = status;

//     await bet.userId.save({ session });
//     await bet.save({ session });

//     await WrestlingBetHistory.updateOne(
//       {
//         userId: bet.userId._id,
//         sid: bet.sid,
//         gameId: bet.gameId,
//       },
//       {
//         status: bet.status,
//         betResult: bet.betResult,
//         resultAmount: bet.resultAmount,
//       },
//       { session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     return res.status(200).json({
//       success: true,
//       message: "Bet settled successfully",
//       bet,
//     });

//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

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

      // opposite type
      const oppositeType = type === "back" ? "lay" : "back";

      // find opposite team dynamically
      const oppositeTeam = bet.teamName === team ? null : bet.teamName;

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

      if (isWin) {
        if (bet.otype === "back") {
          payout = bet.price + bet.betAmount;
        } else {
          payout = bet.betAmount;
        }

        user.credit += payout;
        bet.status = 1; // Win
        bet.resultAmount = payout;
      } else {
        bet.status = 2; // Loss
        bet.resultAmount = 0;
      }

      await bet.save();
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "All bets settled with opposite logic",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
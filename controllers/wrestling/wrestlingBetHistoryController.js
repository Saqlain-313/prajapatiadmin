const WrestlingBetHistory = require("../../models/WRESTLING/WrestlingBetHistory");
const User = require("../../models/usermodel"); 

// 🔹 Get All Bet History (Admin)
exports.getAllWrestlingBetHistory = async (req, res) => {
  try {
    const bets = await WrestlingBetHistory.find()
      .populate("user")       // ✅ full user document
      .populate("match")      // ✅ full match document
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

// 🔹 Get Logged In User Bet History
exports.getMyWrestlingBetHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const bets = await WrestlingBetHistory.find({ user: userId })
      .populate("match", "mid")
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


exports.getWrestlingBetHistoryByMid = async (req, res) => {
  try {
    const { mid } = req.params;

    if (!mid) {
      return res.status(400).json({
        success: false,
        message: "Match MID is required",
      });
    }

    console.log(mid)

    const bets = await WrestlingBetHistory.find({ mid }) 
      .populate("user")      // full user details
      .populate("match")     // full match details
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
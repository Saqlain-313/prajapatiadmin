const WrestlingBet = require("../../models/WRESTLING/WrestlingBet");


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
  try {
    const { result } = req.body; // WON / LOST / CANCELLED

    const bet = await WrestlingBet.findById(req.params.id).populate("user");

    if (!bet) {
      return res.status(404).json({
        success: false,
        message: "Bet not found",
      });
    }

    if (bet.settled) {
      return res.status(400).json({
        success: false,
        message: "Bet already settled",
      });
    }

    bet.result = result;
    bet.settled = true;

    // 💰 CREDIT LOGIC
    if (result === "WON") {
      bet.user.credit += bet.profit;
    }

    if (result === "CANCELLED") {
      bet.user.credit += bet.stake;
    }

    await bet.user.save();
    await bet.save();

    res.status(200).json({
      success: true,
      message: "Bet settled successfully",
      bet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
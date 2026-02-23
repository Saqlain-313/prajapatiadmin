const Deposit = require("../models/Deposit");
const User = require("../models/usermodel");
const ReferralSetting = require("../models/ReferralSetting");


// ===============================
// CREATE RECHARGE REQUEST
// ===============================
exports.createDeposit = async (req, res) => {
  try {
    const { utr, amount } = req.body;

    // Validation
    if (!utr || !amount) {
      return res.status(400).json({
        success: false,
        message: "UTR and Amount are required",
      });
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Optional: minimum recharge limit
    if (numericAmount < 100) {
      return res.status(400).json({
        success: false,
        message: "Minimum recharge is 100",
      });
    }

    // UTR duplicate check
    const utrExists = await Deposit.findOne({ utr: utr.trim() });
    if (utrExists) {
      return res.status(400).json({
        success: false,
        message: "UTR already used",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create recharge entry
    const deposit = await Deposit.create({
      user: user._id,
      userUid: user.uid,
      mobile: user.mobile,
      amount: numericAmount,
      utr: utr.trim(),
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Recharge request submitted. Waiting for approval.",
      depositId: deposit._id,
    });

  } catch (error) {
    console.error("Create Deposit Error:", error);
    res.status(500).json({
      success: false,
      message: "Recharge failed",
    });
  }
};



// ===============================
// GET MY RECHARGES (USER)
// ===============================
exports.getMyDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      deposits,
    });

  } catch (error) {
    console.error("Get My Deposits Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recharge history",
    });
  }
};



// ===============================
// GET ALL RECHARGES (ADMIN)
// ===============================
exports.getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find()
      .populate("user", "uid mobile email credit")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      deposits,
    });

  } catch (error) {
    console.error("Get All Deposits Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recharges",
    });
  }
};

// ===============================
// UPDATE RECHARGE STATUS (ADMIN)
// ===============================
exports.updateDepositStatus = async (req, res) => {
  try {
    const { status, remark } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Recharge not found",
      });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Recharge already processed",
      });
    }

    deposit.status = status;
    deposit.adminRemark = remark || null;
    await deposit.save();

    // ===============================
    // IF APPROVED
    // ===============================
    if (status === "approved") {

      const user = await User.findById(deposit.user);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Add recharge amount
      user.credit += deposit.amount;
      await user.save();

      // ===============================
      // REFERRAL COMMISSION
      // ===============================
      if (user.inviteCode) {

        const referrer = await User.findOne({
          myInviteCode: user.inviteCode,
        });

        if (referrer) {

          const approvedCount = await Deposit.countDocuments({
            user: user._id,
            status: "approved",
          });

          const setting = await ReferralSetting.findOne({
            level: approvedCount,
          });

          if (setting && setting.percent > 0) {

            const commission =
              (deposit.amount * setting.percent) / 100;

            referrer.credit += commission;
            await referrer.save();
          }
        }
      }
    }

    res.json({
      success: true,
      message: `Recharge ${status} successfully`,
    });

  } catch (error) {
    console.error("Update Deposit Error:", error);
    res.status(500).json({
      success: false,
      message: "Status update failed",
    });
  }
};


exports.getDeposits = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};

    const deposits = await Deposit.find(filter)
      .populate("user", "name mobile balance")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: deposits.length,
      deposits,
    });
  } catch (error) {
    console.error("GET DEPOSITS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
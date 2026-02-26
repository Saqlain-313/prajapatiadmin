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



exports.getTotalDepositStats = async (req, res) => {
  try {
    const result = await Deposit.aggregate([
      {
        $match: {
          status: { $in: ["approved", "pending"] },
        },
      },
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    let approvedTotal = 0;
    let pendingTotal = 0;
    let approvedCount = 0;
    let pendingCount = 0;

    result.forEach((item) => {
      if (item._id === "approved") {
        approvedTotal = item.totalAmount;
        approvedCount = item.count;
      }
      if (item._id === "pending") {
        pendingTotal = item.totalAmount;
        pendingCount = item.count;
      }
    });

    res.json({
      success: true,
      data: {
        approved: {
          totalAmount: approvedTotal,
          totalCount: approvedCount,
        },
        pending: {
          totalAmount: pendingTotal,
          totalCount: pendingCount,
        },
        grandTotal: approvedTotal + pendingTotal,
      },
    });
  } catch (error) {
    console.error("Deposit Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate deposit totals",
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
    const depositId = req.params.id;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const deposit = await Deposit.findById(depositId);

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

    // ===============================
    // UPDATE DEPOSIT STATUS (NO save())
    // ===============================

    const updateFields = {
      status,
      adminRemark: remark || null,
    };

    if (status === "approved") {
      updateFields.approvedAt = new Date();
    }

    if (status === "rejected") {
      updateFields.rejectedAt = new Date();
    }

    await Deposit.findByIdAndUpdate(depositId, updateFields);

    // ===============================
    // IF APPROVED → ADD USER CREDIT
    // ===============================
    if (status === "approved") {

      const user = await User.findById(deposit.user);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // 💰 Add recharge amount
      await User.findByIdAndUpdate(user._id, {
        $inc: { credit: deposit.amount },
      });

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

            await User.findByIdAndUpdate(referrer._id, {
              $inc: { credit: commission },
            });
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
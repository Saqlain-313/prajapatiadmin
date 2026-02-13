const mongoose = require("mongoose");
const Withdrawal = require("../models/withdrawalModel");
const User = require("../models/usermodel");

/* ============================
   USER → REQUEST WITHDRAWAL
============================ */
exports.createWithdrawal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { amount, method, upiId, bankDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // 🔒 Atomically lock balance
    const user = await User.findOneAndUpdate(
      { _id: userId, credit: { $gte: amount } },
      { $inc: { credit: -amount } },
      { new: true, session }
    );

    if (!user) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const withdrawal = await Withdrawal.create(
      [{
        user: userId,
        amount,
        method,
        upiId,
        bankDetails,
        status: "pending",
      }],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Withdrawal request submitted",
      withdrawal: withdrawal[0],
    });

  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ message: "Withdrawal failed" });
  } finally {
    session.endSession();
  }
};

/* ============================
   USER → MY WITHDRAWALS
============================ */
exports.getMyWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, withdrawals });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

/* ============================
   ADMIN → ALL WITHDRAWALS
============================ */
exports.getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("user", "mobile email uid")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, withdrawals });
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

/* ============================
   ADMIN → APPROVE
============================ */
exports.approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;

    const withdrawal = await Withdrawal.findOneAndUpdate(
      { _id: id, status: "pending" },
      {
        status: "approved",
        processedAt: new Date(),
      },
      { new: true }
    );

    if (!withdrawal) {
      return res.status(400).json({ message: "Invalid or already processed" });
    }

    res.json({
      success: true,
      message: "Withdrawal approved",
    });

  } catch (err) {
    res.status(500).json({ message: "Approval failed" });
  }
};

/* ============================
   ADMIN → REJECT
============================ */
exports.rejectWithdrawal = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { remark } = req.body;

    const withdrawal = await Withdrawal.findOne({
      _id: id,
      status: "pending",
    }).session(session);

    if (!withdrawal) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid request" });
    }

    // 💰 refund atomically
    await User.updateOne(
      { _id: withdrawal.user },
      { $inc: { credit: withdrawal.amount } },
      { session }
    );

    withdrawal.status = "rejected";
    withdrawal.adminRemark = remark || "Rejected by admin";
    withdrawal.processedAt = new Date();
    await withdrawal.save({ session });

    await session.commitTransaction();

    res.json({
      success: true,
      message: "Withdrawal rejected & amount refunded",
    });

  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: "Rejection failed" });
  } finally {
    session.endSession();
  }
};

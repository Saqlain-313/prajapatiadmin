const crypto = require("crypto");
const mongoose = require("mongoose");
const razorpay = require("../config/razorpay");

const UserDeposit = require("../models/UserDeposit");
const User = require("../models/usermodel");
const ReferralSetting = require("../models/ReferralSetting");

/* ==================================
   CREATE RAZORPAY ORDER (USER)
================================== */
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.user._id).select("uid mobile");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    await UserDeposit.create({
      user: user._id,
      userUid: user.uid,
      mobile: user.mobile,
      amount,
      razorpayOrderId: order.id,
      status: "pending",
    });

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

/* ==================================
   VERIFY RAZORPAY PAYMENT (USER)
================================== */
exports.verifyRazorpayPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    /* ===== SIGNATURE VERIFY ===== */
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    /* ===== APPROVE DEPOSIT (ONCE ONLY) ===== */
    const deposit = await UserDeposit.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, status: "pending" },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "approved",
        approvedAt: new Date(),
      },
      { new: true, session }
    );

    if (!deposit) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Deposit already processed" });
    }

    /* ===== CREDIT USER (ATOMIC) ===== */
    const user = await User.findByIdAndUpdate(
      deposit.user,
      { $inc: { credit: deposit.amount } },
      { new: true, session }
    );

    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User not found" });
    }

    /* ===== REFERRAL COMMISSION ===== */
    if (user.inviteCode) {
      const approvedCount = await UserDeposit.countDocuments(
        { user: user._id, status: "approved" },
        { session }
      );

      const setting = await ReferralSetting.findOne(
        { level: approvedCount },
        null,
        { session }
      );

      if (setting && setting.percent > 0) {
        const commission = (deposit.amount * setting.percent) / 100;

        await User.updateOne(
          { myInviteCode: user.inviteCode },
          { $inc: { credit: commission } },
          { session }
        );
      }
    }

    await session.commitTransaction();

    res.json({
      success: true,
      message: "Payment verified & balance credited",
    });
  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  } finally {
    session.endSession();
  }
};

/* ======================
   MY DEPOSITS (USER)
====================== */
exports.getMyDeposits = async (req, res) => {
  try {
    const deposits = await UserDeposit.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, deposits });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deposits" });
  }
};

/* ======================
   ALL USER DEPOSITS (ADMIN)
====================== */
exports.getAllUserDeposits = async (req, res) => {
  try {
    const deposits = await UserDeposit.find()
      .populate("user", "uid mobile email")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, deposits });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deposits" });
  }
};


exports.updateUserDepositStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { status, remark } = req.body;

    /* ---------------- VALIDATION ---------------- */
    if (!["approved", "rejected"].includes(status)) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Invalid status" });
    }

    /* ---------------- UPDATE DEPOSIT ---------------- */
    const deposit = await UserDeposit.findOneAndUpdate(
      { _id: req.params.id, status: "pending" },
      {
        status,
        adminRemark: remark || null,
        approvedAt: status === "approved" ? new Date() : null,
      },
      { new: true, session }
    );

    if (!deposit) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Deposit already processed" });
    }

    /* ---------------- IF APPROVED ---------------- */
    if (status === "approved") {
      const user = await User.findByIdAndUpdate(
        deposit.user,
        { $inc: { credit: deposit.amount } },
        { new: true, session }
      );

      /* ---------- REFERRAL COMMISSION ---------- */
      if (user?.inviteCode) {
        const approvedCount = await UserDeposit.countDocuments(
          { user: user._id, status: "approved" }
        ).session(session);

        const setting = await ReferralSetting.findOne(
          { level: approvedCount }
        ).session(session);

        if (setting && setting.percent > 0) {
          const commission = (deposit.amount * setting.percent) / 100;

          await User.updateOne(
            { myInviteCode: user.inviteCode },
            { $inc: { credit: commission } },
            { session }
          );
        }
      }
    }

    /* ---------------- COMMIT ---------------- */
    await session.commitTransaction();

    /* 🔥 VERY IMPORTANT — RETURN UPDATED DEPOSIT */
    res.json({
      success: true,
      message: `Deposit ${status} successfully`,
      deposit,
    });

  } catch (err) {
    await session.abortTransaction();
    console.error("UPDATE DEPOSIT ERROR:", err);

    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  } finally {
    session.endSession();
  }
};


exports.getDeposits = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};

    const deposits = await UserDeposit.find(filter)
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

const Deposit = require("../models/Deposit");
const User = require("../models/usermodel");
const ReferralSetting = require("../models/ReferralSetting");
const Product = require("../models/Product");


exports.createDeposit = async (req, res) => {
  try {
    const { utr, productId } = req.body;

    if (!utr || !productId) {
      return res.status(400).json({ message: "UTR & Product required" });
    }

    const utrUsed = await Deposit.findOne({ utr });
    if (utrUsed) {
      return res.status(400).json({ message: "UTR already used" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const product = await Product.findById(productId);
    if (!product || !product.enabled) {
      return res.status(404).json({ message: "Invalid product" });
    }

    const deposit = await Deposit.create({
      user: user._id,
      userUid: user.uid,
      mobile: user.mobile,
      product: product._id,
      amount: product.price,
      utr,
    });

    res.status(201).json({
      success: true,
      message: "Deposit submitted, waiting for approval",
      depositId: deposit._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Deposit failed" });
  }
};


exports.getMyDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({ user: req.user._id })
      .populate("product", "title price")
      .sort({ createdAt: -1 });

    res.json({ success: true, deposits });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deposits" });
  }
};


exports.getAllDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find()
      .populate("user", "uid mobile email")
      .populate("product", "title price")
      .sort({ createdAt: -1 });

    res.json({ success: true, deposits });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch deposits" });
  }
};

exports.updateDepositStatus = async (req, res) => {
  try {
    const { status, remark } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const deposit = await Deposit.findById(req.params.id);
    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    if (deposit.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Deposit already processed" });
    }

    deposit.status = status;
    deposit.adminRemark = remark || null;
    await deposit.save();

    if (status === "approved") {
      const user = await User.findById(deposit.user);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.credit += deposit.amount;
      await user.save();

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
      message: `Deposit ${status} successfully`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

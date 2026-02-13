const ReferralSetting = require("../models/ReferralSetting");

exports.setReferralCommission = async (req, res) => {
  try {
    const { level, percent } = req.body;

    if (!level || percent < 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const setting = await ReferralSetting.findOneAndUpdate(
      { level },
      { percent },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Referral commission updated",
      setting,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update commission" });
  }
};

exports.getReferralCommissions = async (req, res) => {
  const settings = await ReferralSetting.find().sort({ level: 1 });
  res.json({ success: true, settings });
};

exports.updateReferralCommission = async (req, res) => {
  try {
    const { level, percent } = req.body;

    if (!level || percent === undefined || percent < 0) {
      return res.status(400).json({
        success: false,
        message: "Level and valid percent are required",
      });
    }

    const setting = await ReferralSetting.findOneAndUpdate(
      { level },
      { percent },
      { new: true }
    );

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Referral level not found",
      });
    }

    res.json({
      success: true,
      message: "Referral commission updated successfully",
      setting,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update referral commission",
    });
  }
};

exports.deleteReferralCommission = async (req, res) => {
  try {
    const { level } = req.params;

    if (!level) {
      return res.status(400).json({
        success: false,
        message: "Level is required",
      });
    }

    const deleted = await ReferralSetting.findOneAndDelete({ level });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Referral level not found",
      });
    }

    res.json({
      success: true,
      message: "Referral commission deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete referral commission",
    });
  }
};

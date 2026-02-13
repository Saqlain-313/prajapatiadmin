const mongoose = require("mongoose");

const referralSettingSchema = new mongoose.Schema(
  {
    level: {
      type: Number, 
      required: true,
      unique: true,
    },
    percent: {
      type: Number, 
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReferralSetting", referralSettingSchema);

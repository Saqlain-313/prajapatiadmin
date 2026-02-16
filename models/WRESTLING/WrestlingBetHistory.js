const mongoose = require("mongoose");

const wrestlingBetHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WrestlingMatch",
      required: true,
    },

    bet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WrestlingBet",
      required: true,
    },

    mid: {
      type: String,
      required: true,
    },

    teamTid: {
      type: String,
      required: true,
    },

    teamName: {
      type: String,
      required: true,
    },

    boxId: {
      type: Number,
      required: true,
    },

    btype: {
      type: String,
      enum: ["BACK", "LAY"],
      required: true,
    },

    rate: {
      type: Number,
      required: true,
    },

    stake: {
      type: Number,
      required: true,
    },

    profit: {
      type: Number,
      required: true,
    },

    liability: {
      type: Number,
      required: true,
    },

    result: {
      type: String,
      enum: ["PENDING", "WON", "LOST", "CANCELLED"],
      default: "PENDING",
      index: true,
    },

    settled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "WrestlingBetHistory",
  wrestlingBetHistorySchema
);
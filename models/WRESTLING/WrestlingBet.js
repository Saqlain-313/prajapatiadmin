const mongoose = require("mongoose");

const wrestlingBetSchema = new mongoose.Schema(
  {
    /* =====================
       USER INFO
    ===================== */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // aapka user model name
      required: true,
      index: true,
    },

    /* =====================
       MATCH INFO
    ===================== */
    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WrestlingMatch",
      required: true,
      index: true,
    },

    mid: {
      type: Number,
      required: true,
      index: true,
    },

    /* =====================
       TEAM + BOX INFO
    ===================== */
    teamTid: {
      type: Number,
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

    /* =====================
       BET VALUES
    ===================== */
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
      default: 0,
    },

    liability: {
      type: Number,
      default: 0,
    },

    /* =====================
       RESULT
    ===================== */
    result: {
      type: String,
      enum: ["PENDING", "WON", "LOST", "CANCELLED"],
      default: "PENDING",
      index: true,
    },

    settled: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

/* =====================
   IMPORTANT INDEXES
===================== */
wrestlingBetSchema.index({ user: 1, match: 1 });
wrestlingBetSchema.index({ mid: 1, result: 1 });

module.exports = mongoose.model("WrestlingBet", wrestlingBetSchema);
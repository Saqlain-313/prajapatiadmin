const mongoose = require("mongoose");

const wrestlingBetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    gameId: {
      type: String,
      required: true,
    },
    invite: String,
    userRole: String,
    sid: {
      type: String,
      required: true,
    },
    otype: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    xValue: {
      type: Number,
      required: true,
    },
    resultAmount: {
      type: Number,
      default: 0,
    },
    betAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
    },
    eventName: {
      type: String,
      required: true,
    },
    marketName: {
      type: String,
      required: true,
    },
    gameType: {
      type: String,
      required: true,
    },
    gameName: {
      type: String,
      required: true,
    },
    teamName: {
      type: String,
      required: true,
    },
    betResult: String,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* =====================
   IMPORTANT INDEXES
===================== */
wrestlingBetSchema.index({ user: 1, sid: 1 });
wrestlingBetSchema.index({ sid: 1, result: 1 });

module.exports = mongoose.model("WrestlingBet", wrestlingBetSchema);
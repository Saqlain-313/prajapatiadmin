const mongoose = require("mongoose");

/* =====================
   MATCH TIMER
===================== */
const timerSchema = new mongoose.Schema(
  {
    hour: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    sec: { type: Number, default: 0 },
  },
  { _id: false }
);

/* =====================
   BOX
===================== */
const boxSchema = new mongoose.Schema(
  {
    boxId: { type: Number, required: true },
    btype: {
      type: String,
      enum: ["BACK", "LAY"],
      required: true,
    },
    rate: { type: Number, default: 0 },
    size: { type: Number, default: 0 },
  },
  { _id: false }
);

/* =====================
   TEAM
===================== */
const teamSchema = new mongoose.Schema(
  {
    tid: { type: Number, required: true },
    tname: { type: String, required: true },

    // ✅ UPDATED ENUM
    side: {
      type: String,
      enum: ["A", "B", "DQ"], // ← ADDED DQ
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },

    boxes: {
      type: [boxSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length === 6,
        message: "Each team must have exactly 6 boxes",
      },
    },
  },
  { _id: false }
);

/* =====================
   MATCH
===================== */
const wrestlingMatchSchema = new mongoose.Schema(
  {
    gmid: {
      type: Number,
      index: true,
    },

    mid: {
      type: Number,
      unique: true,
      index: true,
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "OPEN", "CLOSED"],
      default: "PENDING",
      index: true,
    },

    betStatus: {
      type: String,
      enum: ["ACTIVE", "DEACTIVE"],
      default: "ACTIVE",
      index: true,
    },

    // ✅ NEW FIELD
    disqualify: {
      type: String,
      enum: ["NONE", "TEAM_A", "TEAM_B", "BOTH"],
      default: "NONE",
      index: true,
    },

    gameType: {
      type: String,
      default: "ODD",
      trim: true,
      index: true,
    },

    eventName: {
      type: String,
      trim: true,
    },

    maxb: { type: Number, default: 0 },
    maxbet: { type: Number, default: 0 },
    minbet: { type: Number, default: 0 },

    img: {
      type: String,
      default: null,
    },

    matchTimer: {
      type: timerSchema,
      default: () => ({ hour: 0, min: 0, sec: 0 }),
    },

    teams: {
      type: [teamSchema],
      required: true,
      validate: {
        validator: (v) =>
          Array.isArray(v) && (v.length === 2 || v.length === 3),
        message: "Match must have 2 or 3 teams (A, B, optional DQ)",
      },
    },
  },
  { timestamps: true }
);

/* =====================
   INDEXES
===================== */
wrestlingMatchSchema.index({ status: 1, startTime: 1 });
wrestlingMatchSchema.index({ disqualify: 1 });

module.exports = mongoose.model("WrestlingMatch", wrestlingMatchSchema);
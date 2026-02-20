const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ IMPORTANT: STRING not Number
    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin","subadmin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },

    isDemo: {
      type: Boolean,
      default: false,
    },

    credit: {
      type: Number,
      default: 0,
    },

    totalWithdrawn: {
      type: Number,
      default: 0,
    },

    inviteCode: {
      type: String,
      default: null,
    },

    myInviteCode: {
      type: String,
      unique: true,
      default: () => uuidv4().slice(0, 8),
    },

    reset_otp: {
      type: String,
      select: false,
      default: null,
    },

    reset_otp_expiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.methods.isOtpExpired = function () {
  return !this.reset_otp_expiry || this.reset_otp_expiry < Date.now();
};

/* ======================
   CREDIT METHODS
====================== */
userSchema.methods.addCredit = async function (amount) {
  if (amount <= 0) throw new Error("Invalid credit amount");
  this.credit += amount;
  return this.save();
};

userSchema.methods.withdrawCredit = async function (amount) {
  if (amount <= 0) throw new Error("Invalid withdrawal amount");
  if (this.credit < amount) throw new Error("Insufficient credit");

  this.credit -= amount;
  this.totalWithdrawn += amount;
  return this.save();
};


module.exports = mongoose.model("User", userSchema);
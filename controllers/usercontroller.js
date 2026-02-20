const User = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendResetPasswordOTP = require("../utils/emailService");

/* =========================
   HELPERS
========================= */

// JWT TOKEN
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const normalizeEmail = (email) =>
  email ? email.trim().toLowerCase() : null;

const generateInviteCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = Math.floor(100000 + Math.random() * 900000).toString();
    exists = await User.findOne({ myInviteCode: code });
  }

  return code;
};

/* =========================
   REGISTER
========================= */
const register = async (req, res) => {
  try {
    let { mobile, password, inviteCode, isDemo = false } = req.body;

    mobile = mobile?.toString();

    if (!mobile) {
      return res.status(400).json({ success: false, message: "Valid mobile required" });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const [hashedPassword, myInviteCode] = await Promise.all([
      bcrypt.hash(password, 10),
      generateInviteCode()
    ]);

    const user = await User.create({
      mobile,
      password: hashedPassword,
      inviteCode: inviteCode || null,
      myInviteCode,
      status: "active",
      isDemo: Boolean(isDemo),
      wallet: { balance: 0, totalWithdrawn: 0 },
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        uid: user.uid,
        mobile: user.mobile,
        status: user.status,
        isDemo: user.isDemo,
        wallet: user.wallet,
        myInviteCode: user.myInviteCode,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "Account already exists" });
    }

    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



/* =========================
   LOGIN
========================= */
const login = async (req, res) => {
  try {
    let { mobile, password } = req.body;

    mobile = mobile?.toString().trim();

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "Mobile and password required",
      });
    }

    // ✅ Get password field
    const user = await User.findOne({ mobile }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    if (user.status === "blocked") {
      return res.status(403).json({
        success: false,
        message: "Account is blocked",
      });
    }

    // ✅ COMPARE HERE
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const admin = generateToken(user._id);

    res.cookie("admin", admin, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      admin,
      user: {
        id: user._id,
        uid: user.uid,
        mobile: user.mobile,
        role: user.role,
        credit: user.credit,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* =========================
   GET PROFILE
========================= */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================
   LOGOUT
========================= */
const logout = async (req, res) => {
  res.clearCookie("admin", {
    httpOnly: true,
    secure: true,          // production me true
    sameSite: "none",      // agar set karte waqt none diya tha
    path: "/",             // same path hona chahiye
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

/* =========================
   FORGOT PASSWORD (SEND OTP)
========================= */
const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    email = normalizeEmail(email);

    if (!email)
      return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.reset_otp = otp;
    user.reset_otp_expiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendResetPasswordOTP(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   VERIFY OTP & RESET PASSWORD
========================= */
const verifyOTPAndReset = async (req, res) => {
  try {
    let { email, otp, newPassword } = req.body;
    email = normalizeEmail(email);
    otp = otp?.toString();

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.reset_otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (Date.now() > user.reset_otp_expiry)
      return res.status(400).json({ message: "OTP expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.reset_otp = null;
    user.reset_otp_expiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Both passwords required",
      });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ALL USERS (ADMIN)
========================= */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -reset_otp -reset_otp_expiry")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("GET ALL USERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================
   DELETE USER (ADMIN)
========================= */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID required",
      });
    }

    // optional: admin khud ko delete na kar paye
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  logout,
  forgotPassword,
  verifyOTPAndReset,
  changePassword,
  deleteUser,
  getAllUsers
};

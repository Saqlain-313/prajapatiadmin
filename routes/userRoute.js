const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile,
  logout,
  changePassword,
  forgotPassword,
  verifyOTPAndReset,
  getAllUsers,
  deleteUser,
} = require("../controllers/usercontroller");

const protect = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);

router.get("/getprofile", protect, getProfile);
router.post("/logout", protect, logout);
router.post("/change-password", protect, changePassword);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyOTPAndReset);

router.get("/users", protect, getAllUsers);
router.delete("/users/:userId", protect, deleteUser);

module.exports = router;

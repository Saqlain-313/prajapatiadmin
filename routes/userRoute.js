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

router.post("/admin/register", register);
router.post("/admin/login", login);

router.get("/admin/getprofile", protect, getProfile);
router.post("/admin/logout", protect, logout);
router.post("/admin/change-password", protect, changePassword);

router.post("/admin/forgot-password", forgotPassword);
router.post("/admin/reset-password", verifyOTPAndReset);

router.get("/admin/users", protect, getAllUsers);
router.delete("/admin/users/:userId", protect, deleteUser);

module.exports = router;

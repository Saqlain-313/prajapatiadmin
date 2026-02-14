const verifySuperAdmin = require("../models/Admin");

const verifyAdminKeyQuery = async (req, res, next) => {
  try {
    const  admin_key  = "C1o9EGOjzyp0";

    if (!admin_key) {
      return res.status(401).json({
        success: false,
        message: "admin_key is required",
      });
    }

    const isValid = await verifySuperAdmin({adminKey:admin_key});

    if (!isValid) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin_key",
      });
    }

    // ✅ verified → controller ko allow
    next();
  } catch (err) {
    console.error("❌ Admin Key Verify Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Admin verification failed",
    });
  }
};

module.exports = verifyAdminKeyQuery;

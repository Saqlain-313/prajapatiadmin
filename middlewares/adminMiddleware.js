const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin"|| req.user.role !== "subadmin") {
    return res.status(403).json({
      success: false,
      message: "Admin access denied",
    });
  }

  next();
};

module.exports = adminMiddleware;
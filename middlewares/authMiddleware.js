const jwt = require("jsonwebtoken");
const User = require("../models/usermodel");

const protect = async (req, res, next) => {
  let admin;

  try {

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      admin = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.admin) {
      admin = req.cookies.admin;
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, admin missing",
      });
    }

    const decoded = jwt.verify(admin, process.env.JWT_SECRET);



    const user = await User.findById(decoded.id).select("-password");


    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Admin not found",
      });
    }



    req.user = user;
    next();

  } catch (error) {
    console.error("Auth  Middleware  Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized, admin invalid or expired",
    });
  }
};



module.exports = protect;

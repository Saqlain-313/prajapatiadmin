const express = require("express");
const router = express.Router();


const protect = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { createProduct, updateProduct, } = require("../controllers/productController");



router.post("/",  createProduct);


router.put("/:id", protect, adminMiddleware, updateProduct);



module.exports = router;

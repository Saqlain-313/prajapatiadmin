const express = require("express");
const router = express.Router();


const protect = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { createProduct, updateProduct, } = require("../controllers/productController");



router.post("/products/",  createProduct);


router.put("/products/:id", protect, adminMiddleware, updateProduct);



module.exports = router;

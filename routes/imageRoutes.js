const express = require("express");
const upload = require("../middlewares/upload");
const {
    uploadImages,
    updateImageByIndex,
    getImages,
    deleteImageByIndex,
} = require("../controllers/imageController");

const router = express.Router();

router.post(
    "/images/upload",
    upload.any(),
    uploadImages
);

router.get("/images/", getImages);

router.put("/images/update/:index",   upload.single("image"), updateImageByIndex);

router.delete("/images/delete/:index", deleteImageByIndex);


module.exports = router;

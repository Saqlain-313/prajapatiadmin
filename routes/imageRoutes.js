const express = require("express");
const upload = require("../middlewares/upload");
const {
    uploadImages,
    updateImageByIndex,
    getImages,
} = require("../controllers/imageController");

const router = express.Router();

router.post(
    "/upload",
    upload.any(),
    uploadImages
);

router.get("/", getImages);

router.put("/update/:index", upload.any(), updateImageByIndex);

module.exports = router;

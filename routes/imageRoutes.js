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
    "/notification/upload",
    upload.any(),
    uploadImages
);

router.get("/notification/", getImages);

router.put("/notification/update/:index",   upload.single("image"), updateImageByIndex);

router.delete("/notification/delete/:index", deleteImageByIndex);


module.exports = router;

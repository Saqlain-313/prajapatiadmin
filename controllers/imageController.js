const ImageCollection = require("../models/ImageCollection");
const uploadToImgbb = require("../utils/uploadToImgbb");

exports.uploadImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    let collection = await ImageCollection.findOne();
    if (!collection) collection = new ImageCollection();

    if (collection.images.length + files.length > 20) {
      return res.status(400).json({
        message: "Total images cannot exceed 20",
      });
    }

    for (const file of files) {
      const uploaded = await uploadToImgbb(file.buffer);
      collection.images.push(uploaded);
    }

    await collection.save();

    res.status(201).json({
      success: true,
      images: collection.images,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image upload failed" });
  }
};

exports.updateImageByIndex = async (req, res) => {
  try {
    const { index } = req.params;
    const file = req.file;

    

    if (!file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const collection = await ImageCollection.findOne();
    if (!collection || !collection.images[index]) {
      return res.status(404).json({ message: "Image not found" });
    }

    const uploaded = await uploadToImgbb(file.buffer);

    collection.images[index] = uploaded;
    await collection.save();

    res.json({
      success: true,
      updatedImage: uploaded,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image update failed" });
  }
};

exports.getImages = async (req, res) => {
  try {
    const collection = await ImageCollection.findOne(
      {},
      { images: 1, _id: 0 }
    ).lean(); // 🚀 faster response

    if (!collection || !Array.isArray(collection.images)) {
      return res.status(200).json({
        success: true,
        total: 0,
        images: [],
      });
    }

    const images = collection.images;
    const total = images.length;

    return res.status(200).json({
      success: true,
      total,
      images,
    });
  } catch (error) {
    console.error("GET IMAGES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch images",
    });
  }
};
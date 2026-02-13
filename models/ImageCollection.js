const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    delete_url: {
      type: String, // imgbb delete URL (important for updates)
    },
  },
  { _id: false }
);

const imageCollectionSchema = new mongoose.Schema(
  {
    images: {
      type: [imageSchema],
      validate: [
        {
          validator: function (arr) {
            return arr.length <= 20;
          },
          message: "Maximum 20 images allowed",
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ImageCollection", imageCollectionSchema);

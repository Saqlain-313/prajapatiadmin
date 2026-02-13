const Product = require("../models/Product");
const slugify = require("slugify");

/* =====================================================
   ADMIN → CREATE PRODUCT (AUTO SLUG USING SLUGIFY)
   ===================================================== */
exports.createProduct = async (req, res) => {
  try {
    const { title, price } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title & price required" });
    }

    // 🔥 base slug
    let baseSlug = slugify(title, {
      lower: true,
      strict: true, // remove special chars
      trim: true,
    });

    let slug = baseSlug;
    let count = 1;

    // 🔁 ensure unique slug
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const product = await Product.create({
      title,
      price,
      slug,
    });

    res.status(201).json({
      success: true,
      message: "Product created",
      product,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Product creation failed" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.title) {
      let baseSlug = slugify(updates.title, {
        lower: true,
        strict: true,
        trim: true,
      });

      let slug = baseSlug;
      let count = 1;

      while (
        await Product.findOne({
          slug,
          _id: { $ne: req.params.id },
        })
      ) {
        slug = `${baseSlug}-${count++}`;
      }

      updates.slug = slug;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

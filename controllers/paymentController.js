const QRCode = require("qrcode");
const Product = require("../models/Product");

exports.generateUpiQR = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product || !product.enabled) {
      return res.status(404).json({ message: "Invalid product" });
    }

    const upiId = process.env.UPI_ID;
    const payeeName = process.env.UPI_NAME;

    // 🔥 UNIQUE EVERY TIME
    const txnId = `TXN_${product._id}_${Date.now()}`;

    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      payeeName
    )}&am=${product.price}&cu=INR&tn=${encodeURIComponent(
      `${product.title} | ${txnId}`
    )}`;

    const qrImage = await QRCode.toDataURL(upiLink, {
      errorCorrectionLevel: "H",
      margin: 2,
      scale: 8,
    });

    res.json({
      success: true,
      product: {
        id: product._id,
        title: product.title,
        amount: product.price,
      },
      transactionId: txnId,
      upiLink,
      qrImage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "QR generation failed" });
  }
};

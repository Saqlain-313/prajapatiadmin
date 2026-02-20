const QRCode = require("qrcode");

exports.generateUpiQR = async (req, res) => {
  try {
    const { amount } = req.body;

    // ======================
    // Validation
    // ======================
    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const numericAmount = Number(amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // Optional minimum recharge limit
    if (numericAmount < 100) {
      return res.status(400).json({
        success: false,
        message: "Minimum recharge is 100",
      });
    }

    const upiId = process.env.UPI_ID;
    const payeeName = process.env.UPI_NAME;

    if (!upiId || !payeeName) {
      return res.status(500).json({
        success: false,
        message: "UPI configuration missing",
      });
    }

    // ======================
    // Unique Transaction ID
    // ======================
    const txnId = `TXN_${req.user._id}_${Date.now()}`;

    const note = `Wallet Recharge | ${txnId}`;

    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      payeeName
    )}&am=${numericAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

    const qrImage = await QRCode.toDataURL(upiLink, {
      errorCorrectionLevel: "H",
      margin: 2,
      scale: 8,
    });

    res.json({
      success: true,
      amount: numericAmount,
      transactionId: txnId,
      upiLink,
      qrImage,
    });

  } catch (error) {
    console.error("QR Generation Error:", error);
    res.status(500).json({
      success: false,
      message: "QR generation failed",
    });
  }
};
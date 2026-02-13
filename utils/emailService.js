const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ============================================================
   1️⃣ ACCOUNT VERIFICATION OTP  (REGISTER)
   ============================================================ */
exports.sendAccountVerificationOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"wrestling" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your wrestling Account",
      html: `
        <div style="font-family:Arial; padding:20px;">
          <h2 style="color:#003366;">Welcome to wrestling 🎉</h2>
          <p>Use the OTP below to verify your account:</p>

          <h1 style="color:#003366; letter-spacing:4px;">${otp}</h1>

          <p>This OTP is valid for <strong>5 minutes</strong>.</p>

          <br>
          <p>Regards,<br><strong>wrestling Team</strong></p>
        </div>
      `
    });

    return true;
  } catch (err) {
    console.log("Verification OTP Email Error:", err);
    return false;
  }
};


/* ============================================================
   2️⃣ PASSWORD RESET OTP  (FORGOT PASSWORD)
   ============================================================ */
exports.sendResetPasswordOTP = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: `"wrestling" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password – OTP Inside",
      html: `
        <div style="font-family:Arial; padding:20px;">
          <h2 style="color:#C21807;">Password Reset Request</h2>
          <p>Please use the OTP below to reset your wrestling password:</p>

          <h1 style="color:#C21807; letter-spacing:4px;">${otp}</h1>

          <p>If you did NOT request this, please ignore this email.</p>
          <p>OTP expires in <strong>5 minutes</strong>.</p>

          <br>
          <p>Regards,<br><strong>wrestling Support</strong></p>
        </div>
      `
    });

    return true;
  } catch (err) {
    console.log("Password Reset OTP Email Error:", err);
    return false;
  }
};


/* ============================================================
   3️⃣ UNIVERSAL MAIL SENDER FOR SUBSCRIBERS
   ============================================================ */
exports.sendGeneralEmail = async ({ email, subject, message }) => {
  try {
    await transporter.sendMail({
      from: `"wrestling" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial; padding: 10px;">
          <h2>${subject}</h2>
          <p>${message}</p>
          <br/>
          <p>Regards,<br/><strong>wrestling</strong></p>
        </div>
      `
    });

  } catch (err) {
    console.log("General Email Send Error:", err);
  }
};


/* ============================================================
   4️⃣ SEND LOGIN CREDENTIALS (AUTO CREATED USER)
   ============================================================ */
exports.sendLoginCredentials = async (email, password) => {
  try {
    await transporter.sendMail({
      from: `"wrestling" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your wrestling Login Credentials",
      html: `
        <div style="font-family:Arial; padding:20px; border:1px solid #eee;">
          <h2 style="color:#003366;">Welcome to wrestling 🎓</h2>

          <p>Your account has been created successfully.</p>

          <p><strong>Login Details:</strong></p>
          <p>
            📧 <strong>Email:</strong> ${email}<br/>
            🔑 <strong>Password:</strong> ${password}
          </p>

          <p style="color:#C21807;">
            ⚠️ For security reasons, please change your password after login.
          </p>

          <br/>
          <p>Regards,<br/><strong>wrestling Team</strong></p>
        </div>
      `
    });

    return true;
  } catch (err) {
    console.log("Login Credentials Email Error:", err);
    return false;
  }
};

const nodemailer = require("nodemailer");
const Otp = require("../models/otp");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(email) {
  const otp = generateOTP();
  // saving to mongo
  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
    { upsert: true }
  );
  const mailOptions = {
    from: `"Local Hands" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Local Hands OTP for sign up",
    html: `
    <div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 420px;
      margin: 30px auto;
      background: #ffffff;
      border: 1px solid #e6e6e6;
      border-radius: 12px;
      padding: 30px 25px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      text-align: center;
    ">
      <div style="margin-bottom: 15px;">
        <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="Lock Icon" width="60" height="60"/>
      </div>
      <h2 style="color: #333; margin-bottom: 10px;">Email Verification</h2>
      <p style="color: #666; font-size: 15px; margin-bottom: 25px;">
        Use the following One-Time Password (OTP) to verify your email address.
      </p>
      <div style="
        background: linear-gradient(135deg, #6a5af9, #826bf9);
        color: #fff;
        font-size: 24px;
        letter-spacing: 4px;
        font-weight: bold;
        padding: 14px 0;
        border-radius: 8px;
        margin-bottom: 25px;
      ">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #888;">
        This OTP will expire in <strong>5 minutes</strong>.
      </p>
      <hr style="border:none; border-top:1px solid #eee; margin:25px 0;">
      <p style="font-size:12px; color:#aaa;">
        If you didn’t request this, please ignore this email.<br>
        &copy; ${new Date().getFullYear()} <strong>Local Hands</strong>
      </p>
    </div>
  `,
  };
  await transporter.sendMail(mailOptions);
  return otp;
}

async function verifyOtp(email, otp) {
  const record = await Otp.findOne({ email });
  if (!record) return false;
  const isValid = record.otp === otp && record.expiresAt > new Date();
  if (isValid) await Otp.deleteOne({ email });
  return isValid;
}

module.exports = { sendOtpEmail, verifyOtp };

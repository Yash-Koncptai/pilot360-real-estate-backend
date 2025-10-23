const bcrypt = require("bcryptjs");
const User = require("../../model/user/user.model");
const { generateJWT } = require("../../utils/jwt");
const OTP = require("../../model/user/otp.model");
const { Op } = require("sequelize");
const { sendOtpEmail } = require("../../utils/emailjs");

class UserController {
  async singup(req, res, next) {
    try {
      const { name, mobile, email, password } = req.body;
      if (!name || !mobile || !email || !password)
        return res
          .status(400)
          .json({ success: false, message: "missing required fields." });
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name: name,
        email: email,
        mobile: mobile,
        password: hashedPassword,
        verification: false,
      });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
      await OTP.create({
        email: email,
        otp: otp,
        expires_at: expiresAt,
      });
      try {
        await sendOtpEmail({ toEmail: email, toName: name, otp });
      } catch (e) {
        console.error(
          "Failed to send signup OTP email:",
          e?.response?.data || e.message
        );
      }

      res.status(201).json({
        success: true,
        otp: otp,
        message: "user created successfully.",
      });
    } catch (err) {
      res.status(409).json({ success: false, message: "user already exist." });
    }
  }

  async verifyotp(req, res, next) {
    try {
      const { email, otp } = req.body;
      const data = await OTP.findOne({
        where: { email: email, otp: otp, expires_at: { [Op.gt]: new Date() } },
      });

      if (!data)
        return res
          .status(400)
          .json({ success: false, message: "OTP expired or invalid." });

      const user = await User.findOne({ where: { email: email } });
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "user not found." });
      user.verification = true;
      await user.save();

      await data.destroy();

      res.status(200).json({
        success: true,
        message: "email and mobile verified successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async otprequest(req, res, next) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email: email } });
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "user not found." });

      await OTP.destroy({ where: { email: email } });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
      await OTP.create({
        email: email,
        otp: otp,
        expires_at: expiresAt,
      });
      try {
        await sendOtpEmail({ toEmail: email, toName: user.name, otp });
      } catch (e) {
        console.error(
          "Failed to send resend OTP email:",
          e?.response?.data || e.message
        );
      }

      res
        .status(200)
        .json({ success: true, otp: otp, message: "OTP send successfully." });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { identifier, password } = req.body;
      if (!identifier || !password) {
        return res
          .status(400)
          .json({ success: false, message: "missing required fields." });
      }

      const user = await User.findOne({
        where: { [Op.or]: [{ email: identifier }, { mobile: identifier }] },
      });
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "invalid credentials." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(400)
          .json({ success: false, message: "invalid credentials." });

      if (!user.verification)
        return res.status(403).json({
          success: false,
          message: "email and mobile number not verified.",
        });

      const token = generateJWT(user.email, "user");
      res.status(200).json({
        success: true,
        token: token,
        message: "user logged in successfully.",
      });
    } catch (err) {
      console.log("err ", err);
      next(err);
    }
  }
}

module.exports = new UserController();

const User = require("../../model/user/user.model");
const Property = require("../../model/admin/property.model");
const { generateReferralCode } = require("../../utils/referralCode");
const { sendEmail } = require("../../utils/emailjs");
const bcrypt = require("bcryptjs");

class UserController {
  async adduser(req, res, next) {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "missing required fields.",
        });
      }
      const password = await generateReferralCode("USER", 12);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        verification: true,
      });

      try {
        await sendEmail({
          toEmail: email,
          toName: name,
          subject: "credentials",
          data: { email, password },
        });
      } catch (emailError) {
        console.error(
          "Failed to send credentials email:",
          emailError?.response?.data || emailError.message
        );
      }

      res.status(200).json({
        success: true,
        user: user,
        message: "user created successfully and credentials sent via email.",
      });
    } catch (err) {
      next(err);
    }
  }

  async usersfetching(req, res, next) {
    try {
      const users = await User.findAll();
      const properties = await Property.findAll();
      res.status(200).json({
        success: true,
        users: users,
        properties: properties,
        message: "users fetch successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();

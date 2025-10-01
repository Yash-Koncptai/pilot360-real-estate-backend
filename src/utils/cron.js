const cron = require("node-cron");
const Otp = require("../model/user/otp.model");
const { Op } = require("sequelize");

cron.schedule("0 12,18 * * *", async () => {
  try {
    const result = await Otp.destroy({
      where: {
        expires_at: {
          [Op.lt]: new Date(),
        },
      },
    });

    console.log(`✅ Cleaned up ${result} expired OTP(s)`);
  } catch (err) {
    console.error("❌ Failed to clean up expired OTPs:", err);
  }
});

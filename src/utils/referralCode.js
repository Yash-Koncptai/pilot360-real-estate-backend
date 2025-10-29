const User = require("../model/user/user.model");

// Generate unique referral code
async function generateReferralCode(prefix = "", length = 8) {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let code;
  let isUnique = false;

  while (!isUnique) {
    let result = prefix;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    code = result;

    const existingUser = await User.findOne({ where: { referralCode: code } });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return code;
}

module.exports = { generateReferralCode };

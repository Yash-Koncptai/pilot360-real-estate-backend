const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;
const User = require("../model/user/user.model");

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not set in environment variables.");
}

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "authorization token missing or malformed.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role != "user") {
      return res
        .status(403)
        .json({ success: false, message: "invalid or expired token." });
    }

    req.user = {
      email: decoded.email,
      role: decoded.role,
    };

    const user = User.findOne({ where: { email: decoded.email } });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "user not found." });

    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "invalid or expired token." });
  }
}

module.exports = verifyJWT;

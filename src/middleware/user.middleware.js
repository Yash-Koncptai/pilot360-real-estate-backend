const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;
const User = require("../model/user/user.model");

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not set in environment variables.");
}

async function verifyJWT(req, res, next) {
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
    if (decoded.role !== "user") {
      return res
        .status(403)
        .json({ success: false, message: "invalid or expired token." });
    }

    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found." });
    }

    req.user = {
      email: user.email,
      role: decoded.role,
      id: user.id,
      dbRole: user.role,
    };

    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "invalid or expired token." });
  }
}

// Optional authentication middleware - doesn't fail if no token provided
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token provided, continue without authentication
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== "user") {
      // Invalid role, continue without authentication
      return next();
    }

    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) {
      // User not found, continue without authentication
      return next();
    }

    req.user = {
      email: user.email,
      role: decoded.role,
      id: user.id,
      dbRole: user.role,
    };

    next();
  } catch (err) {
    // Invalid token, continue without authentication
    next();
  }
}

// Broker-specific middleware - checks if user has Broker role in database
async function verifyBroker(req, res, next) {
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
    if (decoded.role !== "user") {
      return res
        .status(403)
        .json({ success: false, message: "invalid or expired token." });
    }

    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "user not found." });
    }

    if (user.role !== "Broker") {
      return res
        .status(403)
        .json({ success: false, message: "broker access required." });
    }

    req.user = {
      email: user.email,
      role: decoded.role,
      id: user.id,
      dbRole: user.role,
    };

    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "invalid or expired token." });
  }
}

module.exports = verifyJWT;
module.exports.optionalAuth = optionalAuth;
module.exports.verifyBroker = verifyBroker;

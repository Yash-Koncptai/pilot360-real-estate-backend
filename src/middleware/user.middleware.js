const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not set in environment variables.");
}

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "authorization token missing or malformed." })
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role != "user"){
       return res.status(403).json({ success: false, message: "invalid or expired token." })
    } 
    
    req.user = {
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "invalid or expired token." })
  }
}

module.exports = verifyJWT

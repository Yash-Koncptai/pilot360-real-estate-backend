const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY is not set in environment variables.");
}

function generateJWT(email, role) {
  const payload = {
    email,
    role,
  };

  const options = {
    expiresIn: "72h",
  };

  return jwt.sign(payload, SECRET_KEY, options);
}

module.exports = {
  generateJWT,
};

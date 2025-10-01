const express = require("express");
const userController = require("../controllers/user/user.controller");
const propertyController = require("../controllers/user/property.controller");
const inquiryController = require("../controllers/user/inquiry.controller");
const auth = require("../middleware/user.middleware");

const router = express.Router();

// Signup & Login
router.post("/signup", userController.singup);
router.post("/otp/verify", userController.verifyotp);
router.post("/otp", userController.otprequest);
router.post("/login", userController.login);

// Property
router.get("/properties", propertyController.propertiesfetch);
router.get("/property", propertyController.propertyfetch);

// Inquiry
router.post("/inquiry", auth, inquiryController.productinquiry);

module.exports = router;

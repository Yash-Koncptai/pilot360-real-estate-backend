const express = require("express");
const userController = require("../controllers/user/user.controller");
const propertyController = require("../controllers/user/property.controller");
const inquiryController = require("../controllers/user/inquiry.controller");
const auth = require("../middleware/user.middleware");
const preferenceController = require("../controllers/user/preference.controller");
const upload = require("../utils/multer");

const router = express.Router();

// Signup & Login
router.post("/signup", userController.singup);
router.post("/otp/verify", userController.verifyotp);
router.post("/otp", userController.otprequest);
router.post("/login", userController.login);

// Property
router.get(
  "/properties",
  auth.optionalAuth,
  propertyController.propertiesfetch
);
router.get("/property", auth.optionalAuth, propertyController.propertyfetch);
router.get("/recommendations", auth, propertyController.getRecommendations);
router.get("/suggestions", auth, propertyController.getSuggestedProperties);
router.post(
  "/property/add",
  auth.verifyBroker,
  upload.array("images", 20),
  propertyController.addproperty
);

// Inquiry
router.post("/inquiry", auth, inquiryController.productinquiry);
router.post("/contact", inquiryController.contactus);

// Preferences
router.post("/preferences", auth, preferenceController.save);

module.exports = router;

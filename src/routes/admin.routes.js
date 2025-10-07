const express = require("express");
const auth = require("../middleware/admin.middleware");
const adminController = require("../controllers/admin/admin.controller");
const propertyController = require("../controllers/admin/property.controller");
const dashboardController = require("../controllers/admin/dashboard.controller");
const userController = require("../controllers/admin/user.controller");
const suggestionController = require("../controllers/admin/suggestion.controller");
const inquiryController = require("../controllers/admin/inquiry.controller");
const upload = require("../utils/multer");

const router = express.Router();

// Login
router.post("/login", adminController.login);

// Property Management
router.get("/property", auth, propertyController.showproperties);
router.post(
  "/property/add",
  auth,
  upload.array("images", 10),
  propertyController.addproperty
);
router.put(
  "/property/update",
  auth,
  upload.array("images", 10),
  propertyController.editproperty
);
router.delete("/property/delete", auth, propertyController.deleteproperty);

// Dashboard
router.get("/dashboard", auth, dashboardController.dashboard);
router.get("/analytics", auth, dashboardController.analytics);

// Users
router.get("/users", auth, userController.usersfetching);

// Suggestions
router.post("/suggestions", auth, suggestionController.suggestproperty);

// Inquiries
router.get("/inquiries", auth, inquiryController.inquiriesfetching);

module.exports = router;

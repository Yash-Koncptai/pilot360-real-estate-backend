const express = require("express")
const auth = require("../middleware/admin.middleware")
const adminController = require("../controllers/admin/admin.controller")
const propertyController = require("../controllers/admin/property.controller")
const dashboardController = require("../controllers/admin/dashboard.controller")
const userController = require("../controllers/admin/user.controller")

const router = express.Router()

// Login
router.post("/login", adminController.login)

// Property Management
router.get("/property", auth, propertyController.showproperties)
router.post("/property/add", auth, propertyController.addproperty)
router.put("/property/update", auth, propertyController.editproperty)
router.delete("/property/delete", auth, propertyController.deleteproperty)

// Dashboard
router.get("/dashboard", auth, dashboardController.dashboard)
router.get("/analytics", dashboardController.analytics)

// Users
router.get("/users", auth, userController.usersfetching)

module.exports = router
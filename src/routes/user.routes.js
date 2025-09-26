const express = require("express")
const userController = require("../controllers/user/user.controller")
const propertyController = require("../controllers/user/property.controller")

const router = express.Router()

// Signup & Login
router.post("/signup", userController.singup)
router.post("/otp/verify", userController.verifyotp)
router.post("/otp", userController.otprequest)
router.post("/login", userController.login)

// Property
router.get("/property",propertyController.propertyfetch)

module.exports = router
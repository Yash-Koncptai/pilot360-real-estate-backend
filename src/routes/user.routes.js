const express = require("express")
const userController = require("../controllers/user/user.controller")

const router = express.Router()

// Signup & Login
router.post("/signup", userController.singup)
router.post("/otp/verify", userController.verifyotp)
router.post("/otp", userController.otprequest)
router.post("/login", userController.login)

module.exports = router
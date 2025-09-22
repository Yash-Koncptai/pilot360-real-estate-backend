const express = require("express")
const adminController = require("../controllers/admin/admin.controller")
const propertyController = require("../controllers/admin/product.controller")

const router = express.Router()

router.post("/login", adminController.login)
router.post("/property/add", propertyController.addproperty)

module.exports = router
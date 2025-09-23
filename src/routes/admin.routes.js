const express = require("express")
const auth = require("../middleware/admin.middleware")
const adminController = require("../controllers/admin/admin.controller")
const propertyController = require("../controllers/admin/product.controller")

const router = express.Router()

// Login
router.post("/login", adminController.login)

// Property Management
router.get("/property", auth, propertyController.showproperties)
router.post("/property/add", auth, propertyController.addproperty)
router.put("/property/update", auth, propertyController.editproperty)

module.exports = router
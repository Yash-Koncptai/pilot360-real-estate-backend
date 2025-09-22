const bcrypt = require("bcryptjs")
const Admin = require("../../model/admin/admin.model")
const { generateJWT } = require("../../utils/jwt")

class AdminController {
    async login (req, res, next) {
        try {
            const { username, password } = req.body
            const admin = await Admin.findOne({ where: { username } }) 

            if (!admin) return res.status(400).json({ success: false, message: "invalid credentials" })
            
            const isMatch = await bcrypt.compare(password, admin.password)
            if (!isMatch) return res.status(400).json({ success: false, message: "invalid credentials" })

            const token = generateJWT(admin.email, "admin")
            res.status(200).json({ success: true, token: token, message: "admin logged in successfully" });
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new AdminController()
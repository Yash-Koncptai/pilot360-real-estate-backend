const bcrypt = require("bcryptjs")
const User = require("../../model/user/user.model")
const { generateJWT } = require("../../utils/jwt")
const { client } = require("../../config/redis")
const { Op } = require('sequelize')

class UserController {
    async singup (req, res, next) {
        try {
            const { name, mobile, email, password } = req.body
            if (!name || !mobile || !email || !password) return res.status(400).json({ success: false, message: "missing required fields." })
            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await User.create({
                name: name,
                email: email,
                mobile: mobile,
                password: hashedPassword,
                verification: false,
            })
            const otp = Math.floor(100000 + Math.random() * 900000).toString()

            await client.set(`otp:${email}`, otp, {
                EX: 180,
            });
            // sendOtp()

            res.status(201).json({ success: true, otp: otp, message: "user created successfully." })
        } catch (err) {
            next(err)
        }
    }

    async verifyotp (req, res, next) {
        try {
            const { email, otp } = req.body
            const data = await client.get(`otp:${email}`)

            if (!data) return res.status(400).json({ success: false, message: "OTP expired or not found." })

            if (data != otp) return res.status(400).json({ success: false, message: "invalid OTP." })

            const user = await User.findOne({ where: { email: email } })
            user.verification = true
            await user.save()

            res.status(200).json({ success: true, message: "email and mobile verified successfully." });
        } catch (err) {
            next(err)
        }
    }

    async login (req, res, next) {
        try {
            const { identifier, password } = req.body
            if (!identifier || !password) {
                return res.status(400).json({ success: false, message: "missing required fields." });
            }

            const user = await User.findOne({ where: { [Op.or]: [ {email: identifier}, {mobile: identifier} ] } })
            if (!user) return res.status(400).json({ success: false, message: "invalid credentials." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ success: false, message: "invalid credentials." })

            if (!user.verification) return res.status(403).json({ success: false, message: "email and mobile number not verified." })

            const token = generateJWT(user.email, "user")
            res.status(200).json({ success: true, token: token, message: "user logged in successfully." });
        } catch (err) {
            console.log("err ",err)
            next(err)
        }
    }
}

module.exports = new UserController()
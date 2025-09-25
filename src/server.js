require("dotenv").config()
require("./utils/cron")

const app = require("./app")
const sequelize = require("./config/database")
const bcrypt = require("bcryptjs")
const Admin = require("./model/admin/admin.model")

const PORT = process.env.PORT;

(async () => {
  try {
    await sequelize.authenticate()
    console.log("✅ Database connected.")

    await sequelize.sync();

    const existingAdmin = await Admin.findOne({ where: { email: process.env.ADMINEMAIL } })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMINPASS, 10)

      const admin = await Admin.create({
        username: process.env.ADMINUSERNAME,
        email: process.env.ADMINEMAIL,
        password: hashedPassword,
      });
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err)
    process.exit(1)
  }
})()

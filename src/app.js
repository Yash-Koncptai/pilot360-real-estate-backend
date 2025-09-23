const express = require("express")
const sequelize = require("./config/database");
const adminRoutes = require("./routes/admin.routes");
const cors = require('cors')
const logger = require("./utils/logger")

const app = express()
app.use(express.json())
app.use(cors())
app.use(logger)

app.use("/api/admin", adminRoutes)

app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json({ success: false, message: err.message })
})

sequelize.sync()

module.exports = app
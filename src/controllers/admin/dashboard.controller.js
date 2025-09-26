const Property = require("../../model/admin/property.model")

class DashboardController {
    async dashboard (req, res, next) {
        try {
            let count = 0, available = 0, views = 0;
            const properties = await Property.findAll()

            for (const property of properties) {
                views += property.views
                count ++
                if (!property.private) available++
            }

            res.status(200).json({ success: true, properties: count, available: available, views: views, message: "dashboard details fetched successfully." })
        } catch (err) {
            next (err)
        }
    }

    async analytics (req, res, next) {
        try {
            let m = {}

            const properties = await Property.findAll()
            for (const property of properties) {
                m[property.type] = (m[property.type] || 0) + 1
            }

            res.status(200).json({ success: true, property_performance: m, message: "analytics details fetched successfully." })
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new DashboardController()
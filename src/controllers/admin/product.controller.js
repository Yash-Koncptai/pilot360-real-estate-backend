const Property = require("../../model/admin/property.model")

class PropertyController {
    async addproperty (req, res, next) {
        try {
            const { title, price, type, size, location, latitude, longitude, description, privacy, features } = req.body

            if (!title || !price || !type || !size || !location || !latitude || !longitude) {
                return res.status(400).json({ success: false, message: "missing required fields." });
            }

            const property = await Property.create({
                title: title,
                price: price,
                type: type,
                size: size,
                location: location,
                latitude: latitude,
                longitude: longitude,
                description: description,
                private: privacy,
                features: features,
            })

            res.status(201).json({ success: true, property: property, message: "property added successfully" });
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new PropertyController()
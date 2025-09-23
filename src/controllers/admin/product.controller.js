const Property = require("../../model/admin/property.model")

class PropertyController {
    async showproperties (req, res, next) {
        try {
            const properties = await Property.findAll()

            res.status(200).json({ success: true, properties: properties, message: "properties fetched successfully." })
        } catch (err) {
            next(err)
        }
    }

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

            res.status(201).json({ success: true, property: property, message: "property added successfully." });
        } catch (err) {
            next(err)
        }
    }

    async editproperty (req, res, next) {
        try {
            const { title, price, type, size, location, latitude, longitude, description, privacy, features } = req.body
            if (!title || !price || !type || !size || !location || !latitude || !longitude) {
                return res.status(400).json({ success: false, message: "missing required fields." });
            }

            const query = req.query
            const property = await Property.findOne({ where: { id: query.id } })

            if (!property) {
                return res.status(404).json({ success: false, message: "property not found." })
            }

            property.title = title
            property.price = price
            property.type = type
            property.size = size
            property.location = location
            property.latitude = latitude
            property.longitude = longitude
            property.description = description
            property.private = privacy
            property.features = features

            await property.save()

            res.status(200).json({ success: true, property: property, message:"property updated successfully."})
        } catch (err) {
            next(err)
        }
    }

    async deleteproperty (req, res, next) {
        try {
            const query = req.query

            const property = await Property.findOne({ where: { id: query.id } })
            if (!property) {
                return res.status(404).json({ success: false, message: "property not found." })
            }

            await property.destroy()

            res.status(200).json({ success: true, message:"property deleted successfully."})
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new PropertyController()
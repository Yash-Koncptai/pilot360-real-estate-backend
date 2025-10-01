const Property = require("../../model/admin/property.model");
const { Op } = require("sequelize");

class PropertyController {
  async propertyfetch(req, res, next) {
    try {
      const query = req.query;

      const property = await Property.findOne({ where: { id: query.id } });
      if (!property)
        return res
          .status(404)
          .json({ success: false, message: "property not found." });

      property.views++;
      await property.save();

      res.status(200).json({
        success: true,
        property: property,
        message: "property fetched successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async propertiesfetch(req, res, next) {
    try {
      const { type, min, max, location } = req.query;

      const where = {};

      if (type) {
        where.type = type;
      }

      if (min || max) {
        where.price = {};
        if (min) where.price[Op.gte] = Number(min);
        if (max) where.price[Op.lte] = Number(max);
      }

      if (location) {
        const pattern = `%${location}%`;
        where.location = { [Op.iLike]: pattern };
      }

      const properties = await Property.findAll({ where });

      return res.status(200).json({
        success: true,
        properties: properties,
        message: "properties fetched successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PropertyController();

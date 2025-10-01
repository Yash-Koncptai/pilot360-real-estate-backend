const Property = require("../../model/admin/property.model");

class PropertyController {
  async propertiesfetch(req, res, next) {
    try {
      const properties = await Property.findAll();

      res.status(200).json({
        success: true,
        properties: properties,
        message: "properties fetched successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

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

  async propertiesfilter(req, res, next) {
    try {
      const { type, min, max, location } = req.body;
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PropertyController();

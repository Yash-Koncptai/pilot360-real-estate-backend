const Property = require("../../model/admin/property.model");
const Preference = require("../../model/user/preference.model");
const User = require("../../model/user/user.model");
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
      const { type, min, max, location, primary_purpose } = req.query;

      const where = {};

      if (type) {
        where.type = type;
      }

      if (primary_purpose) {
        where.primary_purpose = primary_purpose;
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

  async getRecommendations(req, res, next) {
    try {
      const userEmail = req.user.email;
      console.log("userEmail ", userEmail);
      const user = await User.findOne({ where: { email: userEmail } });

      const userPreference = await Preference.findOne({
        where: { user_id: user.id },
      });

      if (!userPreference) {
        return res.status(403).json({
          success: false,
          message: "please set your preferences first.",
          locked: true,
        });
      }

      const where = {};

      if (
        userPreference.land_interests &&
        Array.isArray(userPreference.land_interests) &&
        userPreference.land_interests.length > 0
      ) {
        where.type = { [Op.in]: userPreference.land_interests };
      }

      if (userPreference.primary_purpose) {
        where.primary_purpose = userPreference.primary_purpose;
      }

      if (userPreference.budget_min || userPreference.budget_max) {
        where.price = {};
        if (userPreference.budget_min) {
          where.price[Op.gte] = userPreference.budget_min;
        }
        if (userPreference.budget_max) {
          where.price[Op.lte] = userPreference.budget_max;
        }
      }

      if (
        userPreference.preferred_location &&
        Array.isArray(userPreference.preferred_location) &&
        userPreference.preferred_location.length > 0
      ) {
        const patterns = userPreference.preferred_location.map(
          (loc) => `%${loc}%`
        );
        where.location = { [Op.iLike]: { [Op.any]: patterns } };
      } else if (userPreference.preferred_location) {
        const pattern = `%${userPreference.preferred_location}%`;
        where.location = { [Op.iLike]: pattern };
      }

      const recommendedProperties = await Property.findAll({
        where,
      });

      return res.status(200).json({
        success: true,
        properties: recommendedProperties,
        message: "recommended properties fetched successfully.",
        locked: false,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PropertyController();

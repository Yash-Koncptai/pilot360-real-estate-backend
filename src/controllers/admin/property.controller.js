const Property = require("../../model/admin/property.model");
const Delete = require("../../utils/filedelete");

class PropertyController {
  async showproperties(req, res, next) {
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

  async addproperty(req, res, next) {
    try {
      const {
        title,
        price,
        type,
        size,
        primary_purpose,
        location,
        latitude,
        longitude,
        description,
        privacy,
        features,
        water_connectivity,
        electricity_connectivity,
        gas_connectivity,
        investment_gain,
        investment_cost,
        market_risk,
        regulatory_risk,
        financial_risk,
        liquidity_risk,
        physical_risk,
      } = req.body;
      if (
        !title ||
        !price ||
        !type ||
        !size ||
        !location ||
        !latitude ||
        !longitude ||
        !primary_purpose ||
        !water_connectivity ||
        !electricity_connectivity ||
        !gas_connectivity ||
        !investment_gain ||
        !investment_cost ||
        !market_risk ||
        !regulatory_risk ||
        !financial_risk ||
        !liquidity_risk ||
        !physical_risk
      ) {
        return res
          .status(400)
          .json({ success: false, message: "missing required fields." });
      }

      const images = req.files
        ? req.files.map((file) =>
            file.path.replace(/^src[\\/]/, "").replace(/\\/g, "/")
          )
        : [];

      let featuresArray = [];
      if (typeof features === "string") {
        featuresArray = features.split(",").map((f) => f.trim());
      }
      let ch = {
        market_risk: { true: 30 },
        regulatory_risk: { true: 25 },
        financial_risk: { true: 10 },
        liquidity_risk: { true: 20 },
        physical_risk: { true: 15 },
      };
      let risk_percentage =
        (ch.market_risk[market_risk] || 0) +
        (ch.regulatory_risk[regulatory_risk] || 0) +
        (ch.financial_risk[financial_risk] || 0) +
        (ch.liquidity_risk[liquidity_risk] || 0) +
        (ch.physical_risk[physical_risk] || 0);
      const property = await Property.create({
        title: title,
        price: price,
        type: type,
        size: size,
        primary_purpose: primary_purpose,
        location: location,
        latitude: latitude,
        longitude: longitude,
        description: description,
        private: privacy,
        features: featuresArray,
        images: images,
        water_connectivity: water_connectivity,
        electricity_connectivity: electricity_connectivity,
        gas_connectivity: gas_connectivity,
        investment_gain: investment_gain || 0,
        investment_cost: investment_cost || 0,
        market_risk: market_risk,
        regulatory_risk: regulatory_risk,
        financial_risk: financial_risk,
        liquidity_risk: liquidity_risk,
        physical_risk: physical_risk,
        risk_percentage: risk_percentage,
      });

      res.status(201).json({
        success: true,
        property: property,
        message: "property added successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async editproperty(req, res, next) {
    try {
      const query = req.query;
      const {
        title,
        price,
        type,
        size,
        primary_purpose,
        location,
        latitude,
        longitude,
        description,
        privacy,
        features,
        existingimages,
        deletedimages,
        water_connectivity,
        electricity_connectivity,
        gas_connectivity,
        investment_gain,
        investment_cost,
        market_risk,
        regulatory_risk,
        financial_risk,
        liquidity_risk,
        physical_risk,
      } = req.body;
      if (
        !title ||
        !price ||
        !type ||
        !size ||
        !location ||
        !latitude ||
        !longitude ||
        !primary_purpose ||
        !water_connectivity ||
        !electricity_connectivity ||
        !gas_connectivity ||
        !investment_gain ||
        !investment_cost ||
        !market_risk ||
        !regulatory_risk ||
        !financial_risk ||
        !liquidity_risk ||
        !physical_risk
      ) {
        return res
          .status(400)
          .json({ success: false, message: "missing required fields." });
      }

      const property = await Property.findOne({ where: { id: query.id } });
      if (!property) {
        return res
          .status(404)
          .json({ success: false, message: "property not found." });
      }

      let newimages = [];
      const images = req.files
        ? req.files.map((file) =>
            file.path.replace(/^src[\\/]/, "").replace(/\\/g, "/")
          )
        : [];
      if (typeof existingimages === "string") {
        const existing = existingimages.split(",").map((f) => f.trim());
        newimages = existing.concat(images);
      } else {
        newimages = images;
      }

      if (typeof deletedimages === "string") {
        const deleted = deletedimages.split(",").map((f) => f.trim());
        for (const v of deleted) {
          await Delete("../" + v);
        }
      }

      let featuresArray = [];
      if (typeof features === "string") {
        featuresArray = features.split(",").map((f) => f.trim());
      }
      let ch = {
        market_risk: { true: 30 },
        regulatory_risk: { true: 25 },
        financial_risk: { true: 10 },
        liquidity_risk: { true: 20 },
        physical_risk: { true: 15 },
      };
      let risk_percentage =
        (ch.market_risk[market_risk] || 0) +
        (ch.regulatory_risk[regulatory_risk] || 0) +
        (ch.financial_risk[financial_risk] || 0) +
        (ch.liquidity_risk[liquidity_risk] || 0) +
        (ch.physical_risk[physical_risk] || 0);

      property.title = title;
      property.price = price;
      property.type = type;
      property.size = size;
      property.primary_purpose = primary_purpose;
      property.location = location;
      property.latitude = latitude;
      property.longitude = longitude;
      property.description = description;
      property.private = privacy;
      property.features = featuresArray;
      property.images = newimages;
      property.water_connectivity = water_connectivity;
      property.electricity_connectivity = electricity_connectivity;
      property.gas_connectivity = gas_connectivity;
      property.investment_gain = investment_gain || property.investment_gain;
      property.investment_cost = investment_cost || property.investment_cost;
      property.market_risk = market_risk;
      property.regulatory_risk = regulatory_risk;
      property.financial_risk = financial_risk;
      property.liquidity_risk = liquidity_risk;
      property.physical_risk = physical_risk;
      property.risk_percentage = risk_percentage;

      await property.save();

      res.status(200).json({
        success: true,
        property: property,
        message: "property updated successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteproperty(req, res, next) {
    try {
      const query = req.query;

      const property = await Property.findOne({ where: { id: query.id } });
      if (!property) {
        return res
          .status(404)
          .json({ success: false, message: "property not found." });
      }

      await property.destroy();

      res
        .status(200)
        .json({ success: true, message: "property deleted successfully." });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PropertyController();

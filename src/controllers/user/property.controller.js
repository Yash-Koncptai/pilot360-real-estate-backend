const Property = require("../../model/admin/property.model");
const Preference = require("../../model/user/preference.model");
const User = require("../../model/user/user.model");
const Suggestion = require("../../model/admin/suggestion.model");
const { Op } = require("sequelize");

class PropertyController {
  static async calculateMatchPercentage(property, userPreference) {
    const hasLandInterests =
      Array.isArray(userPreference.land_interests) &&
      userPreference.land_interests.length > 0;
    const hasPrimaryPurpose = Boolean(userPreference.primary_purpose);
    const hasBudgetRange =
      typeof userPreference.budget_min === "number" &&
      typeof userPreference.budget_max === "number";
    const hasPreferredLocations =
      Array.isArray(userPreference.preferred_location) &&
      userPreference.preferred_location.length > 0;

    const totalCriteria =
      [
        hasLandInterests,
        hasPrimaryPurpose,
        hasBudgetRange,
        hasPreferredLocations,
      ].filter(Boolean).length || 1;

    let matches = 0;

    if (
      hasLandInterests &&
      userPreference.land_interests.includes(property.type)
    ) {
      matches += 1;
    }

    if (
      hasPrimaryPurpose &&
      property.primary_purpose === userPreference.primary_purpose
    ) {
      matches += 1;
    }

    if (
      hasBudgetRange &&
      typeof property.price === "number" &&
      property.price >= userPreference.budget_min &&
      property.price <= userPreference.budget_max
    ) {
      matches += 1;
    }

    if (hasPreferredLocations && typeof property.location === "string") {
      const propertyLocation = property.location.toLowerCase();
      const locationMatched = userPreference.preferred_location.some((loc) =>
        propertyLocation.includes(String(loc).toLowerCase())
      );
      if (locationMatched) matches += 1;
    }

    return Math.round((matches / totalCriteria) * 100);
  }
  async propertyfetch(req, res, next) {
    try {
      const query = req.query;

      const property = await Property.findOne({
        where: { id: query.id, status: "approved" },
      });
      if (!property)
        return res
          .status(404)
          .json({ success: false, message: "property not found." });

      property.views++;
      await property.save();

      let propertyWithMatch = property.toJSON();
      console.log("🔍 Debug - req.user:", req.user);

      if (req.user && req.user.email) {
        console.log("✅ User is authenticated:", req.user.email);
        try {
          const user = await User.findOne({ where: { email: req.user.email } });
          if (user) {
            console.log("✅ User found in database");
            const userPreference = await Preference.findOne({
              where: { user_id: user.id },
            });
            if (userPreference) {
              console.log(
                "✅ User preferences found:",
                userPreference.toJSON()
              );
              const matchPercentage =
                await PropertyController.calculateMatchPercentage(
                  property,
                  userPreference
                );
              propertyWithMatch.matchPercentage = matchPercentage;
              console.log("✅ Match percentage calculated:", matchPercentage);
            } else {
              console.log("❌ No user preferences found");
            }
          } else {
            console.log("❌ User not found in database");
          }
        } catch (preferenceError) {
          console.log(
            "❌ Error calculating match percentage:",
            preferenceError.message
          );
        }
      } else {
        console.log("❌ No authentication - req.user:", req.user);
      }

      res.status(200).json({
        success: true,
        property: propertyWithMatch,
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

      const properties = await Property.findAll({
        where: { status: "approved" },
      });

      let propertiesWithMatch = properties.map((property) => property.toJSON());
      console.log("🔍 Debug - req.user:", req.user);

      if (req.user && req.user.email) {
        console.log("✅ User is authenticated:", req.user.email);
        try {
          const user = await User.findOne({ where: { email: req.user.email } });
          if (user) {
            console.log("✅ User found in database");
            const userPreference = await Preference.findOne({
              where: { user_id: user.id },
            });
            if (userPreference) {
              console.log(
                "✅ User preferences found:",
                userPreference.toJSON()
              );
              propertiesWithMatch = await Promise.all(
                properties.map(async (property) => {
                  const propertyData = property.toJSON();
                  const matchPercentage =
                    await PropertyController.calculateMatchPercentage(
                      property,
                      userPreference
                    );
                  return { ...propertyData, matchPercentage };
                })
              );
              console.log("✅ Match percentages calculated for all properties");
            } else {
              console.log("❌ No user preferences found");
            }
          } else {
            console.log("❌ User not found in database");
          }
        } catch (preferenceError) {
          console.log(
            "❌ Error calculating match percentage:",
            preferenceError.message
          );
        }
      } else {
        console.log("❌ No authentication - req.user:", req.user);
      }

      return res.status(200).json({
        success: true,
        properties: propertiesWithMatch,
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
        });
      }

      const orConditions = [];

      const hasLandInterests =
        Array.isArray(userPreference.land_interests) &&
        userPreference.land_interests.length > 0;
      const hasPrimaryPurpose = Boolean(userPreference.primary_purpose);
      const hasBudgetRange =
        typeof userPreference.budget_min === "number" &&
        typeof userPreference.budget_max === "number";
      const hasPreferredLocations =
        Array.isArray(userPreference.preferred_location) &&
        userPreference.preferred_location.length > 0;

      if (hasLandInterests) {
        orConditions.push({ type: { [Op.in]: userPreference.land_interests } });
      }

      if (hasPrimaryPurpose) {
        orConditions.push({ primary_purpose: userPreference.primary_purpose });
      }

      if (hasBudgetRange) {
        orConditions.push({
          price: {
            [Op.between]: [
              userPreference.budget_min,
              userPreference.budget_max,
            ],
          },
        });
      }

      if (hasPreferredLocations) {
        const patterns = userPreference.preferred_location.map(
          (loc) => `%${loc}%`
        );
        orConditions.push({ location: { [Op.iLike]: { [Op.any]: patterns } } });
      }

      const anyMatchWhere =
        orConditions.length > 0 ? { [Op.or]: orConditions } : {};

      const matchedProperties = await Property.findAll({
        where: anyMatchWhere,
        status: "approved",
      });

      const totalCriteria =
        [
          hasLandInterests,
          hasPrimaryPurpose,
          hasBudgetRange,
          hasPreferredLocations,
        ].filter(Boolean).length || 1;

      const propertiesWithScores = matchedProperties
        .map((prop) => {
          const property = prop.toJSON();

          let matches = 0;

          if (
            hasLandInterests &&
            userPreference.land_interests.includes(property.type)
          ) {
            matches += 1;
          }

          if (
            hasPrimaryPurpose &&
            property.primary_purpose === userPreference.primary_purpose
          ) {
            matches += 1;
          }

          if (
            hasBudgetRange &&
            typeof property.price === "number" &&
            property.price >= userPreference.budget_min &&
            property.price <= userPreference.budget_max
          ) {
            matches += 1;
          }

          if (hasPreferredLocations && typeof property.location === "string") {
            const propertyLocation = property.location.toLowerCase();
            const locationMatched = userPreference.preferred_location.some(
              (loc) => propertyLocation.includes(String(loc).toLowerCase())
            );
            if (locationMatched) matches += 1;
          }

          const matchPercentage = Math.round((matches / totalCriteria) * 100);

          return { ...property, matchPercentage };
        })
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

      return res.status(200).json({
        success: true,
        properties: propertiesWithScores,
        message: "recommended properties fetched successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async getSuggestedProperties(req, res, next) {
    try {
      const userId = req.user.id;

      const suggestion = await Suggestion.findOne({
        where: { user_id: userId },
      });

      if (
        !suggestion ||
        !suggestion.property_ids ||
        suggestion.property_ids.length === 0
      ) {
        return res.status(200).json({
          success: true,
          properties: [],
          message: "no properties suggested by admin yet.",
        });
      }

      const properties = await Property.findAll({
        where: {
          id: { [Op.in]: suggestion.property_ids },
          status: "approved",
        },
      });

      const propertyMap = new Map(
        properties.map((property) => [property.id, property])
      );

      const orderedProperties = suggestion.property_ids
        .map((propertyId) => propertyMap.get(propertyId))
        .filter((property) => property !== undefined);

      let propertiesWithMatch;

      try {
        const userPreference = await Preference.findOne({
          where: { user_id: userId },
        });

        if (userPreference) {
          propertiesWithMatch = await Promise.all(
            orderedProperties.map(async (property) => {
              const propertyData = property.toJSON();
              const matchPercentage =
                await PropertyController.calculateMatchPercentage(
                  property,
                  userPreference
                );
              return { ...propertyData, matchPercentage };
            })
          );
        } else {
          propertiesWithMatch = orderedProperties.map((property) =>
            property.toJSON()
          );
        }
      } catch (preferenceError) {
        console.log(
          "Error calculating match percentage:",
          preferenceError.message
        );
        propertiesWithMatch = orderedProperties.map((property) =>
          property.toJSON()
        );
      }

      return res.status(200).json({
        success: true,
        properties: propertiesWithMatch,
        message: "suggested properties fetched successfully.",
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
        market_risk,
        regulatory_risk,
        financial_risk,
        liquidity_risk,
        physical_risk,
        taluka,
        district,
        nearest_town,
        nearest_road,
        distance_to_nearest_road,
        nearest_school_colleges,
        zoning_status,
        na_permit,
        upcoming_infra,
        ownership_type,
        rera_registration,
        town_planning_permit,
        jantri_rate,
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
        !investment_gain
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

      let nearestSchoolArray = [];
      if (typeof nearest_school_colleges === "string") {
        nearestSchoolArray = nearest_school_colleges
          .split(",")
          .map((f) => f.trim());
      }

      let upcomingInfraArray = [];
      if (typeof upcoming_infra === "string") {
        upcomingInfraArray = upcoming_infra.split(",").map((f) => f.trim());
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
        title,
        price,
        type,
        size,
        primary_purpose,
        location,
        latitude,
        longitude,
        description,
        private: privacy,
        features: featuresArray,
        images,
        water_connectivity,
        electricity_connectivity,
        gas_connectivity,
        investment_gain,
        market_risk,
        regulatory_risk,
        financial_risk,
        liquidity_risk,
        physical_risk,
        risk_percentage,
        return_of_investment: parseFloat(
          (((investment_gain - price) / price) * 100).toFixed(2)
        ),
        taluka,
        district,
        nearest_town,
        nearest_road,
        distance_to_nearest_road,
        nearest_school_colleges: nearestSchoolArray,
        zoning_status,
        na_permit,
        upcoming_infra: upcomingInfraArray,
        ownership_type,
        rera_registration,
        town_planning_permit,
        jantri_rate,

        status: "pending",
        created_by: req.user.id,
      });

      res.status(201).json({
        success: true,
        property,
        message:
          "property submitted for review. it will be visible after admin approval.",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PropertyController();

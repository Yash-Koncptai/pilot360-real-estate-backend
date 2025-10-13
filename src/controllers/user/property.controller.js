const Property = require("../../model/admin/property.model");
const Preference = require("../../model/user/preference.model");
const User = require("../../model/user/user.model");
const { Op } = require("sequelize");

class PropertyController {
  // Helper function to calculate match percentage for a property
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

      const property = await Property.findOne({ where: { id: query.id } });
      if (!property)
        return res
          .status(404)
          .json({ success: false, message: "property not found." });

      property.views++;
      await property.save();

      // Calculate match percentage if user is authenticated
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
          // If preference calculation fails, continue without match percentage
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

      const properties = await Property.findAll({ where });

      // Calculate match percentage for each property if user is authenticated
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
          // If preference calculation fails, continue without match percentage
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

      // Build OR-based search to fetch properties that match ANY preference
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
      });

      // Compute match percentage per property and sort by highest match
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
}

module.exports = new PropertyController();

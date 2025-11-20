const Preference = require("../../model/user/preference.model");
const User = require("../../model/user/user.model");

class PreferenceController {
  async save(req, res, next) {
    try {
      const { email } = req.user;
      const {
        primary_purpose,
        budget_min,
        budget_max,
        land_interests,
        preferred_location,
      } = req.body;

      if (
        !primary_purpose ||
        !budget_min ||
        !budget_max ||
        !land_interests ||
        !preferred_location
      ) {
        return res
          .status(400)
          .json({ success: false, message: "missing required fields." });
      }

      const minValue = Number(budget_min);
      const maxValue = Number(budget_max);
      if (
        Number.isNaN(minValue) ||
        Number.isNaN(maxValue) ||
        minValue < 0 ||
        maxValue < 0 ||
        minValue > maxValue
      ) {
        return res
          .status(400)
          .json({ success: false, message: "invalid budget range." });
      }

      const user = await User.findOne({ where: { email: email } });

      const normalizeToStringArray = (value) => {
        if (Array.isArray(value)) {
          return value.map((v) => String(v).trim()).filter((v) => v.length > 0);
        }
        if (typeof value === "string") {
          return value
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v.length > 0);
        }
        return [];
      };

      const interestsArray = normalizeToStringArray(land_interests);
      const locationArray = normalizeToStringArray(preferred_location);

      if (interestsArray.length === 0 || locationArray.length === 0) {
        return res.status(400).json({
          success: false,
          message:
            "land_interests and preferred_location must be non-empty arrays or comma-separated strings.",
        });
      }

      let preference = await Preference.findOne({
        where: { user_id: user.id },
      });

      if (preference) {
        preference.primary_purpose = primary_purpose;
        preference.budget_min = minValue;
        preference.budget_max = maxValue;
        preference.land_interests = interestsArray;
        preference.preferred_location = locationArray;

        await preference.save();
      } else {
        preference = await Preference.create({
          user_id: user.id,
          primary_purpose: primary_purpose,
          budget_min: minValue,
          budget_max: maxValue,
          land_interests: interestsArray,
          preferred_location: locationArray,
        });
      }

      res.status(201).json({
        success: true,
        preference: preference,
        message: "preferences saved successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async get(req, res, next) {
    try {
      const { email } = req.user;
      const user = await User.findOne({ where: { email: email } });
      const preference = await Preference.findOne({
        where: { user_id: user.id },
      });
      if (!preference) {
        return res
          .status(404)
          .json({ success: false, message: "preference not found." });
      }
      res.status(200).json({
        success: true,
        preference: preference,
        message: "preference fetched successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PreferenceController();

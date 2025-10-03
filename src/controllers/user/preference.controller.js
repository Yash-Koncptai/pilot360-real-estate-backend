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

      let interestsArray = [];
      if (typeof land_interests === "string") {
        interestsArray = land_interests.split(",").map((i) => i.trim());
      }

      let locationArray = [];
      if (typeof preferred_location === "string") {
        locationArray = preferred_location.split(",").map((i) => i.trim());
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
          preferred_location: preferred_location,
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
}

module.exports = new PreferenceController();

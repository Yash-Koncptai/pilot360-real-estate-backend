const Preference = require("../../model/user/preference.model");
const User = require("../../model/user/user.model");

class PreferenceController {
  async save(req, res, next) {
    try {
      const { email } = req.user;
      const { primary_purpose, budget, land_interests, preferred_location } =
        req.body;

      if (
        !primary_purpose ||
        !budget ||
        !land_interests ||
        !preferred_location
      ) {
        return res
          .status(400)
          .json({ success: false, message: "missing required fields." });
      }

      const user = await User.findOne({ where: { email: email } });

      let interestsArray = [];
      if (typeof land_interests === "string") {
        interestsArray = land_interests.split(",").map((i) => i.trim());
      }

      let preference = await Preference.findOne({
        where: { user_id: user.id },
      });

      if (preference) {
        preference.primary_purpose = primary_purpose;
        preference.budget = Number(budget);
        preference.land_interests = interestsArray;
        preference.preferred_location = preferred_location;

        await preference.save();
      } else {
        preference = await Preference.create({
          user_id: user.id,
          primary_purpose: primary_purpose,
          budget: Number(budget),
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

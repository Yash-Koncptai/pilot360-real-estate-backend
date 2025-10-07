const Suggestion = require("../../model/admin/suggestion.model");
const Property = require("../../model/admin/property.model");
const User = require("../../model/admin/user.model");

class SuggestionController {
  async suggestproperty(req, res, next) {
    try {
      const { user_id, property_id } = req.body;
      if (!user_id || !property_id) {
        return res
          .status(400)
          .json({ success: false, message: "missing required fields." });
      }

      const user = await User.findOne({ where: { id: user_id } });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "user not found." });
      }

      const property = await Property.findOne({ where: { id: property_id } });
      if (!property) {
        return res
          .status(404)
          .json({ success: false, message: "property not found." });
      }

      const suggestion = await Suggestion.findOne({
        where: { user_id: user_id },
      });

      if (!suggestion) {
        await Suggestion.create({
          user_id: user_id,
          property_ids: [property_id],
        });
      } else {
        await suggestion.update({
          property_ids: [...suggestion.property_ids, property_id],
        });
      }

      res.status(200).json({
        success: true,
        message: "property suggested successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SuggestionController();

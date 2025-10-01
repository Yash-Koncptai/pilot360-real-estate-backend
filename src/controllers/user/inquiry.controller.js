const User = require("../../model/user/user.model");
const Property = require("../../model/admin/property.model");
const Inquiry = require("../../model/user/inquiry.model");

class InquiryController {
  async productinquiry(req, res, next) {
    try {
      const { email } = req.user;
      const { name, email: mail, visit_date, message } = req.body;
      const query = req.query;

      if (!name || !mail || !visit_date || !message) {
        return res
          .status(400)
          .json({ success: false, message: "missing required fields." });
      }

      const user = await User.findOne({ where: { email: email } });
      const property = await Property.findOne({ where: { id: query.id } });
      if (!property)
        return res
          .status(404)
          .json({ success: false, message: "property not found." });

      const inquiry = await Inquiry.create({
        name: name,
        email: mail,
        visit_date: new Date(visit_date),
        message: message,
        property_id: property.id,
        user_id: user.id,
      });

      res.status(201).json({
        success: true,
        inquiry: inquiry,
        message: "inquiry submitted successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InquiryController();

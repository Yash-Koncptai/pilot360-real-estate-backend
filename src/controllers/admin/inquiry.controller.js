const Inquiry = require("../../model/user/inquiry.model");
const User = require("../../model/user/user.model");
const Property = require("../../model/admin/property.model");

class InquiryController {
  async inquiriesfetching(req, res, next) {
    try {
      if (!Inquiry.associations.user) {
        Inquiry.belongsTo(User, { foreignKey: "user_id", as: "user" });
      }
      if (!Inquiry.associations.property) {
        Inquiry.belongsTo(Property, {
          foreignKey: "property_id",
          as: "property",
        });
      }

      const inquiries = await Inquiry.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["name", "email"],
          },
          {
            model: Property,
            as: "property",
            attributes: [
              "id",
              "title",
              "price",
              "type",
              "size",
              "primary_purpose",
              "location",
            ],
          },
        ],
      });
      return res.status(200).json({
        success: true,
        inquiries: inquiries,
        message: "inquiries fetched successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new InquiryController();

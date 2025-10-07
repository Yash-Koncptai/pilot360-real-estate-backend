const User = require("../../model/user/user.model");
const Property = require("../../model/admin/property.model");

class UserController {
  async usersfetching(req, res, next) {
    try {
      const users = await User.findAll();
      const properties = await Property.findAll();
      res.status(200).json({
        success: true,
        users: users,
        properties: properties,
        message: "users fetch successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();

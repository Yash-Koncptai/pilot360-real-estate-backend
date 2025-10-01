const User = require("../../model/user/user.model");

class UserController {
  async usersfetching(req, res, next) {
    try {
      const users = await User.findAll();
      res.status(200).json({
        success: true,
        users: users,
        message: "users fetch successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();

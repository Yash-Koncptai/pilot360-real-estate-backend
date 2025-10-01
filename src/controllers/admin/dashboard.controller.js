const Property = require("../../model/admin/property.model");
const Inquiry = require("../../model/user/inquiry.model");

class DashboardController {
  async dashboard(req, res, next) {
    try {
      let count = 0,
        available = 0,
        views = 0;
      const properties = await Property.findAll();

      for (const property of properties) {
        views += property.views;
        count++;
        if (!property.private) available++;
      }

      const inquiries = await Inquiry.findAll();

      res.status(200).json({
        success: true,
        properties: count,
        available: available,
        views: views,
        inquiries: inquiries.length,
        message: "dashboard details fetched successfully.",
      });
    } catch (err) {
      next(err);
    }
  }

  async analytics(req, res, next) {
    try {
      let pp = {};
      let mt = {
        "This Month": 0,
        "Last Month": 0,
        "Growth Rate": "",
      };
      let growth = 0;

      const properties = await Property.findAll();
      for (const property of properties) {
        pp[property.type] = (pp[property.type] || 0) + 1;
      }

      const now = new Date();
      const current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const last = new Date(now.getFullYear(), now.getMonth(), 1);
      const inquiries = await Inquiry.findAll();
      for (const inquiry of inquiries) {
        if (inquiry.createdAt < current) {
          mt["This Month"] = (mt["This Month"] || 0) + 1;
        }
        if (inquiry.createdAt < last) {
          mt["Last Month"] = (mt["Last Month"] || 0) + 1;
        }
      }

      let perc = "";
      growth = mt["This Month"] - mt["Last Month"];
      if (mt["Last Month"] != 0) {
        growth = (growth / mt["Last Month"]) * 100;
        perc = "+" + growth + "%";
      }
      if (mt["Last Month"] == 0 && mt["This Month"] != 0) {
        perc = "N/A";
      }
      mt["Growth Rate"] = perc;

      res.status(200).json({
        success: true,
        property_performance: pp,
        monthly_trend: mt,
        message: "analytics details fetched successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DashboardController();

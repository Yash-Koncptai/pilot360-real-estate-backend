const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Suggestion = sequelize.define(
  "suggestion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    property_ids: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Suggestion;

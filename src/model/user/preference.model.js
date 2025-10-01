const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Preference = sequelize.define(
  "preference",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    primary_purpose: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budget: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    land_interests: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    preferred_location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Preference;

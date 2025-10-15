const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Property = sequelize.define(
  "property",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    primary_purpose: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    water_connectivity: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    electricity_connectivity: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    gas_connectivity: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    investment_gain: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    investment_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    market_risk: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    regulatory_risk: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    financial_risk: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    liquidity_risk: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    physical_risk: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    risk_percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    features: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    views: {
      type: DataTypes.INTEGER,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Property;

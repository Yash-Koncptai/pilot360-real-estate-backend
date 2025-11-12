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
    return_of_investment: {
      type: DataTypes.FLOAT,
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
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "approved",
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    taluka: {
      type: DataTypes.STRING,
    },
    district: {
      type: DataTypes.STRING,
    },
    nearest_town: {
      type: DataTypes.STRING,
    },
    nearest_road: {
      type: DataTypes.STRING,
    },
    distance_to_nearest_road: {
      type: DataTypes.FLOAT,
    },
    nearest_school_colleges: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    zoning_status: {
      type: DataTypes.STRING,
    },
    na_permit: {
      type: DataTypes.BOOLEAN,
    },
    upcoming_infra: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    ownership_type: {
      type: DataTypes.STRING,
    },
    rera_registration: {
      type: DataTypes.STRING,
    },
    town_planning_permit: {
      type: DataTypes.STRING,
    },
    jantri_rate: {
      type: DataTypes.FLOAT,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Property;

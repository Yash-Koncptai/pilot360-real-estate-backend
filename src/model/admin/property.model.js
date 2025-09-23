const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Property = sequelize.define("property", {
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
    allowNull: false 
  },
  type: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
   type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
  },
  private: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  features: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  }
}, { 
    timestamps: true 
});

module.exports = Property;
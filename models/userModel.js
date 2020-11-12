const { DataTypes, Sequelize } = require("sequelize");
const validator = require("validator");
const sequelize = require("../utils/db");

const User = sequelize.define("User", {
  regNo: {
    type: DataTypes.STRING(9),
    primaryKey: true,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  phoneNo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isNumeric: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  coreDomains: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  specificDomains: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  puid: {
    type: DataTypes.INTEGER,
  },
  projectLink: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
});

module.exports = User;

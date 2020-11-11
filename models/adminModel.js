const { DataTypes, Sequelize }   = require("sequelize");
const validator = require("validator");
const sequelize = require("../utils/db");

const Admin = sequelize.define("Admin", {
  auid: {
    type: DataTypes.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: Sequelize.UUIDV4,
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
      isAlpha: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
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
  meetLink: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  }
});

module.exports = Admin;

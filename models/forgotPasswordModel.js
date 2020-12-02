const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const ForgotPassword = sequelize.define("ForgotPassword", {
  regNo: {
    type: DataTypes.STRING(9),
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  expiry: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  resent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = ForgotPassword;

const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Admin = sequelize.define(
  "Admin",
  {
    auid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    },
  },
<<<<<<< HEAD
  {
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
  }
);
=======
});
>>>>>>> Updated Admin Model

module.exports = Admin;

const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Comment = sequelize.define("Comment", {
  cuid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  regNo: {
    type: DataTypes.STRING(9),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  auid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  comment: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Comment;

const { DataTypes, Sequelize }   = require("sequelize");
const validator = require("validator");
const sequelize = require("../utils/db");

const Comment = sequelize.define("Comment", {
  cuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    unique: true,
    defaultValue: Sequelize.UUIDV4,
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
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Comment;

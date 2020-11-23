const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Question = sequelize.define("Question", {
  quid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  question: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  mandatory: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Question;

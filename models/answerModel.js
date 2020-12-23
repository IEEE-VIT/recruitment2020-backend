const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Answer = sequelize.define("Answer", {
  regNo: {
    type: DataTypes.STRING(9),
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  quid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  answer: {
    type: DataTypes.STRING(1000),
  },
});

module.exports = Answer;

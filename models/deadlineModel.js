const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Deadline = sequelize.define("Deadline", {
  roundNo: {
    type: DataTypes.ENUM,
    values: ["0", "1", "2", "3"],
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Deadline;

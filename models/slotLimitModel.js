const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const SlotLimit = sequelize.define("SlotLimit", {
  roundNo: {
    type: DataTypes.ENUM,
    values: ["1", "2"],
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  maxCandidates: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = SlotLimit;

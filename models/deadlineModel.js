const { DataTypes } = require("sequelize");
const moment = require("moment-timezone");
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
    get() {
      return moment(this.getDataValue("date")).format("DD MMM");
    },
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    get() {
      if (this.getDataValue("time")) {
        return this.getDataValue("time").slice(0, 5);
      }
      return null;
    },
  },
});

module.exports = Deadline;

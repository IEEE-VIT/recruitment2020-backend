const { DataTypes } = require("sequelize");
const moment = require("moment-timezone");
const sequelize = require("../utils/db");

const Slot = sequelize.define("Slot", {
  suid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  roundNo: {
    type: DataTypes.ENUM,
    values: ["0", "1", "2", "3"],
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  mgmt: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  moderatorId: {
    type: DataTypes.INTEGER,
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
  timeFrom: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    get() {
      if (this.getDataValue("timeFrom")) {
        return this.getDataValue("timeFrom").slice(0, 5);
      }

      return null;
    },
  },
  timeTo: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    get() {
      if (this.getDataValue("timeTo")) {
        return this.getDataValue("timeTo").slice(0, 5);
      }

      return null;
    },
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  gdpLink: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
});

module.exports = Slot;

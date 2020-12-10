const { DataTypes } = require("sequelize");
const moment = require("moment");
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
      return this.getDataValue("timeFrom").slice(0, 5);
    },
  },
  timeTo: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    get() {
      return this.getDataValue("timeTo").slice(0, 5);
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

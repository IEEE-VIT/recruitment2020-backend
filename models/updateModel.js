const { DataTypes } = require("sequelize");
const moment = require("moment-timezone");
const sequelize = require("../utils/db");

const Update = sequelize.define("Update", {
  uuid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  content: {
    type: DataTypes.STRING(1000),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  auid: {
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

module.exports = Update;

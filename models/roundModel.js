const { DataTypes, Sequelize } = require("sequelize");
const validator = require("validator");
const sequelize = require("../utils/db");

const Round = sequelize.define("Round", {
  roundNo: {
    primaryKey: true,
    type: DataTypes.ENUM,
    values: ["0", "1", "2", "3"],
  },
  regNo: {
    type: DataTypes.STRING(9),
    primaryKey: true,
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
  suid: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  cuid: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  exception: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  meetingCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM,
    values: ["PR", "AR", "RR", "ER"],
  },
  domain: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = Round;

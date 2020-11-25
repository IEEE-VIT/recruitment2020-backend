const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Round = sequelize.define("Round", {
  roundNo: {
    type: DataTypes.ENUM,
    values: ["0", "1", "2", "3"],
  },
  regNo: {
    type: DataTypes.STRING(9),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  auid: {
    type: DataTypes.INTEGER,
  },
  suid: {
    type: DataTypes.INTEGER,
    validate: {
      notEmpty: true,
    },
  },
  cuid: {
    type: DataTypes.INTEGER,
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
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  domainType: {
    type: DataTypes.ENUM,
    values: ["TECH", "MGMT", "Unknown"],
    defaultValue: null,
    set(value) {
      switch (value) {
        case "APP":
        case "WEB":
        case "ML":
        case "CYBERSECURITY":
          this.setDataValue("domainType", "TECH");
          break;
        case "MGMT":
          this.setDataValue("domainType", "MGMT");
          break;
        default:
          this.setDataValue("domainType", "Unknown");
      }
    },
  },
});

module.exports = Round;

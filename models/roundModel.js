const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const constants = require("../utils/constants");

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
    values: [
      constants.PendingReview,
      constants.AcceptedReview,
      constants.RejectedReview,
      constants.ExceptionReview,
    ],
  },
  specificDomain: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  coreDomain: {
    type: DataTypes.ENUM,
    values: [constants.Tech, constants.Mgmt, constants.Unknown, constants.Dsn],
    defaultValue: null,
    set(value) {
      switch (value) {
        case value in constants.TechDomain:
          this.setDataValue("coreDomain", constants.Tech);
          break;
        case value in constants.MgmtDomains:
          this.setDataValue("coreDomain", constants.Mgmt);
          break;
        case value in constants.DesignDomains:
          this.setDataValue("coreDomain", constants.Dsn);
          break;
        default:
          this.setDataValue("coreDomain", constants.Unknown);
      }
    },
  },
});

module.exports = Round;

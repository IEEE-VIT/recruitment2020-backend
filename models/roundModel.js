const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const constants = require("../utils/constants");

const TechDomains = constants.TechDomains();
const MgmtDomains = constants.MgmtDomains();
const DsnDomains = constants.DesignDomains();

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
      switch (true) {
        case TechDomains.includes(value):
          this.setDataValue("coreDomain", constants.Tech);
          break;
        case MgmtDomains.includes(value):
          this.setDataValue("coreDomain", constants.Mgmt);
          break;
        case DsnDomains.includes(value):
          this.setDataValue("coreDomain", constants.Dsn);
          break;
        default:
          this.setDataValue("coreDomain", constants.Unknown);
      }
    },
  },
});

module.exports = Round;

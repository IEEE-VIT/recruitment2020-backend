const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../utils/db");

const User = sequelize.define("User", {
  regNo: {
    type: DataTypes.STRING(9),
    primaryKey: true,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  name: {
    type: DataTypes.STRING,
  },
  phoneNo: {
    type: DataTypes.BIGINT,
    unique: true,
    validate: {
      isNumeric: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      const hash = bcrypt.hashSync(value, 10);
      this.setDataValue("password", hash);
    },
  },
  coreDomains: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  specificDomains: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  puid: {
    type: DataTypes.INTEGER,
  },
  projectLink: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
});

User.prototype.isValidPassword = function (password) {
  return bcrypt
    .compare(password, this.password)
    .then((result) => result)
    .catch(() => false);
};

module.exports = User;

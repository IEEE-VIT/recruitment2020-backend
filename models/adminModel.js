const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../utils/db");

const Admin = sequelize.define("Admin", {
  auid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
    set(value) {
      const hash = bcrypt.hashSync(value, 10);
      this.setDataValue("password", hash);
    },
  },
  meetLink: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true,
    },
  },
  superUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Admin.prototype.isValidPassword = function (password) {
  return bcrypt
    .compare(password, this.password)
    .then((result) => result)
    .catch(() => false);
};

module.exports = Admin;

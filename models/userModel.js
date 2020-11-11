const { DataTypes } = require("sequelize");
const validator = require('validator');

const User=sequelize.define('User',{
  RegNo:{
    type:DataTypes.STRING(9),
    validate:{
      notNull:true,
      notEmpty:true
    },
    unique:true
  },
  Name:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true,
      isAlpha:true
    }
  },
  PhoneNo:{
    type:DataTypes.BIGINT(12),
    validate:{
      notNull:true,
      notEmpty:true,
      isNumeric:true,
      unique:true
    },
    unique:true
  },
  Email:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true,
    isEmail:true
  },
  Password:{
    type:DataTypes.STRING,
    allowNull:false
  },
  SelectedDomains:{
    type:DataTypes.ARRAY(DataTypes.STRING)
  },
  ProjectLink:{
    type: DataTypes.STRING,
    validate:{
      isUrl:true
    }
  },
  tableName:'Users'
});

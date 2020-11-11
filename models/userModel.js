const { DataTypes } = require("sequelize");
const validator = require('validator');

const User=sequelize.define('User',{
  RegNo:{
    type:DataTypes.STRING(9),
    primaryKey:true,
    unique:true,
    validate:{
      notNull:true,
      notEmpty:true
    }
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
    unique:true,
    validate:{
      notNull:true,
      notEmpty:true,
      isNumeric:true,
    }
  },
  Email:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true,
      isEmail:true,
    }
  },
  Password:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true
    }
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

module.exports= { User }

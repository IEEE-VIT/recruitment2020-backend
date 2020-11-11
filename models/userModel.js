const { DataTypes } = require("sequelize");
const validator = require('validator');

const User=sequelize.define('User',{
  regNo:{
    type:DataTypes.STRING(9),
    primaryKey:true,
    unique:true,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  name:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true,
      isAlpha:true
    }
  },
  phoneNo:{
    type:DataTypes.BIGINT(12),
    unique:true,
    validate:{
      notNull:true,
      notEmpty:true,
      isNumeric:true,
    }
  },
  email:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true,
      isEmail:true,
    }
  },
  password:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  selectedDomains:{
    type:DataTypes.ARRAY(DataTypes.STRING)
  },
  projectLink:{
    type: DataTypes.STRING,
    validate:{
      isUrl:true
    }
  },
  tableName:'Users'
});

module.exports=User;

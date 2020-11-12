const { DataTypes, Sequelize }   = require("sequelize");
const validator = require("validator");
const sequelize = require("../utils/db");

const Question=sequelize.define('Question',{
  quid:{
    type: DataTypes.INTEGER,
    primaryKey:true,
    unique:true,
    allowNull: false,
    validate:{
      notEmpty:true
    }
  },
  question:{
    type:DataTypes.STRING,
    allowNull: false,
    validate:{
      notEmpty:true
    }
  },
  mandatory:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  }
});

module.exports=Question;

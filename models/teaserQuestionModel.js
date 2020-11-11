const { DataTypes, Sequelize }   = require("sequelize");
const validator = require("validator");
const sequelize = require("../utils/db");

const TeaserQuestion=sequelize.define('TeaserQuestion',{
  quid:{
    type: DataTypes.UUID,
    primaryKey:true,
    unique:true,
    defaultValue: Sequelize.UUIDV4,
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
  }
});

module.exports=TeaserQuestion;

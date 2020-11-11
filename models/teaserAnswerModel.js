const { DataTypes, Sequelize }   = require("sequelize");
const validator = require("validator");
const sequelize = require("../utils/db");

const TeaserAnswer=sequelize.define('TeaserAnswer',{
  regNo:{
    type:DataTypes.STRING(9),
    primaryKey:true,
    allowNull: false,
    validate:{
      notEmpty:true
    }
  },
  quid:{
    type: DataTypes.UUID,
    primaryKey:true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    validate:{
      notEmpty:true
    }
  },
  answer:{
    type:DataTypes.STRING,
    allowNull: false,
    validate:{
      notEmpty:true
    }
  }
});

module.exports=TeaserAnswer;

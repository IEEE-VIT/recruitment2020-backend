const { DataTypes } = require("sequelize");
const validator = require('validator');

const TeaserQuestion=sequelize.define('TeaserQuestion',{
  quid:{
    type: DataTypes.UUID,
    primaryKey:true,
    unique:true,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  question:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  tableName:'TeaserQuestions'
});

module.exports=TeaserQuestion;

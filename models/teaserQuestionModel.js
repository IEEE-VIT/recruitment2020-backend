const { DataTypes } = require("sequelize");
const validator = require('validator');

const TeaserQuestion=sequelize.define('TeaserQuestion',{
  Quid:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    },
    unique:true
  },
  Question:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  tableName:'TeaserQuestions'
});

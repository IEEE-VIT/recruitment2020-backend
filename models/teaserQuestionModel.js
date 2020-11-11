const { DataTypes } = require("sequelize");
const validator = require('validator');

const teaserQuestion=sequelize.define('teaserQuestion',{
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

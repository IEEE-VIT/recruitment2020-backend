const { DataTypes } = require("sequelize");
const validator = require('validator');

const teaserAnswer=sequelize.define('teaserAnswer',{
  RegNo:{
    type:DataTypes.STRING(9),
    validate:{
      notNull:true,
      notEmpty:true
    },
    unique:true
  },
  Quid:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    },
    unique:true
  },
  Answer:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  tableName:'TeaserAnswers'
});

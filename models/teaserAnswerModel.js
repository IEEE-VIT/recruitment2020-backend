const { DataTypes } = require("sequelize");
const validator = require('validator');

const TeaserAnswer=sequelize.define('TeaserAnswer',{
  RegNo:{
    type:DataTypes.STRING(9),
    primaryKey:true,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  Quid:{
    type: DataTypes.UUID,
    primaryKey:true,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
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

module.exports={ TeaserAnswer }

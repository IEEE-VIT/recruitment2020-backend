const { DataTypes } = require("sequelize");
const validator = require('validator');

const Comment=sequelize.define('Comment',{
  Cuid:{
    type: DataTypes.UUID,
    primaryKey:true,
    unique:true,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  RegNo:{
    type:DataTypes.STRING(9),
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  Auid:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  Comment:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true,
    }
  },
  tableName:'Comments'
});

module.exports={ Comment }

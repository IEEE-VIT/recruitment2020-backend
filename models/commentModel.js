const { DataTypes } = require("sequelize");
const validator = require('validator');

const Comment=sequelize.define('Comment',{
  Cuid:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    },
    unique:true
  },
  RegNo:{
    type:DataTypes.STRING(9),
    validate:{
      notNull:true,
      notEmpty:true
    },
    unique:true
  },
  Auid:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    },
    unique:true
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

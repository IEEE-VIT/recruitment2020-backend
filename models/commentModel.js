const { DataTypes } = require("sequelize");
const validator = require('validator');

const Comment=sequelize.define('Comment',{
  cuid:{
    type: DataTypes.UUID,
    primaryKey:true,
    unique:true,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  regNo:{
    type:DataTypes.STRING(9),
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  auid:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  comment:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true,
    }
  },
  tableName:'Comments'
});

module.exports=Comment;

const { DataTypes } = require("sequelize");
const validator = require('validator');

const Admin=sequelize.define('Admin',{
  Auid:{
    type: DataTypes.UUID,
    primaryKey:true,
    unique:true,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  Name:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true,
      isAlpha:true
    }
  },
  Email:{
    type:DataTypes.STRING,
    unique:true,
    validate:{
      notNull:true,
      notEmpty:true,
      isEmail:true
    }
  },
  Password:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  MeetLink:{
    type: DataTypes.STRING,
    validate:{
      isUrl:true
    }
  },
  tableName:'Admins'
});

module.exports={ Admin }

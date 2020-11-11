const { DataTypes } = require("sequelize");
const validator = require('validator');

const Admin=sequelize.define('Admin',{
  Auid:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    },
    unique:true
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
    allowNull:false,
    unique:true,
    isEmail:true
  },
  Password:{
    type:DataTypes.STRING,
    allowNull:false
  },
  MeetLink:{
    type: DataTypes.STRING,
    validate:{
      isUrl:true
    }
  },
  tableName:'Admins'
});

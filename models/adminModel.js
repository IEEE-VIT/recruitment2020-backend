const { DataTypes } = require("sequelize");
const validator = require('validator');

const Admin=sequelize.define('Admin',{
  auid:{
    type: DataTypes.UUID,
    primaryKey:true,
    unique:true,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  name:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true,
      isAlpha:true
    }
  },
  email:{
    type:DataTypes.STRING,
    unique:true,
    validate:{
      notNull:true,
      notEmpty:true,
      isEmail:true
    }
  },
  password:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  meetLink:{
    type: DataTypes.STRING,
    validate:{
      isUrl:true
    }
  },
  tableName:'Admins'
});

module.exports=Admin;

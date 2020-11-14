const { DataTypes, Sequelize }   = require("sequelize");
const validator = require("validator");
const sequelize = require("../utils/db");

const Slot=sequelize.define('Slot',{
  suid:{
    type: DataTypes.INTEGER,
    primaryKey:true,
    unique:true,
    allowNull: false,
    validate:{
      notEmpty:true
    }
  },
  moderatorId: {
    type: DataTypes.INTEGER
  },
  date:{
    type:DataTypes.DATEONLY,
    allowNull: false,
    validate:{
      notEmpty:true
    }
  },
  timeFrom:{
    type:DataTypes.TIME,
    allowNull: false,
    validate:{
      notEmpty:true
    }
  },
  timeTo:{
    type:DataTypes.TIME,
    allowNull: false,
    validate:{
      notEmpty:true
    }
  },
  count:{
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  gdpLink:{
    type: DataTypes.STRING,
    validate:{
      isUrl:true
    }
  }
});

module.exports=Slot;

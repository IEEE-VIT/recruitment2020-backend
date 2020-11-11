const { DataTypes, Sequelize }   = require("sequelize");
const validator = require("validator");
const sequelize = require("../utils/db");

const Slot=sequelize.define('Slot',{
  suid:{
    type: DataTypes.UUID,
    primaryKey:true,
    unique:true,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    validate:{
      notEmpty:true
    }
  },
  moderatorId: {
    type: DataTypes.UUID
  },
  date:{
    type:DataTypes.DATEONLY,
    allowNull: false,
    validate:{
      notEmpty:true
    }
  },
  timeRange:{
    type:DataTypes.STRING,
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

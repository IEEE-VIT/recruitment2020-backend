const { DataTypes } = require("sequelize");
const validator = require('validator');

const Slot=sequelize.define('Slot',{
  suid:{
    type: DataTypes.UUID,
    primaryKey:true,
    unique:true,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  date:{
    type:DataTypes.DATEONLY,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  timeRange:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
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
  },
  tableName:'Slots'
});

module.exports=Slot;

const { DataTypes } = require("sequelize");
const validator = require('validator');

const Slot=sequelize.define('Slot',{
  Suid:{
    type: DataTypes.UUID,
    primaryKey:true,
    unique:true,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  Date:{
    type:DataTypes.DATEONLY,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  TimeRange:{
    type:DataTypes.STRING,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  Count:{
    type:DataTypes.INTEGER,
    defaultValue:0
  },
  GDPLink:{
    type: DataTypes.STRING,
    validate:{
      isUrl:true
    }
  },
  tableName:'Slots'
});

module.exports={ Slot }

const { DataTypes } = require("sequelize");
const validator = require('validator');

const Round=sequelize.define('Round',{
  RoundNo:{
    primaryKey:true,
    type:DataTypes.ENUM,
    values:['0','1','2','3']
  },
  RegNo:{
    type:DataTypes.STRING(9),
    primaryKey:true,
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
  Suid:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  Cuid:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  Exception:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  },
  MeetingCompleted:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  },
  Domain:{
    type:DataTypes.STRING,
    primaryKey:true,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  tableName:'Rounds'
});

module.exports={ Round }

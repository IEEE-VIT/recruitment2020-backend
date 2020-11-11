const { DataTypes } = require("sequelize");
const validator = require('validator');

const Round=sequelize.define('Round',{
  RoundNo:{
    type:DataTypes.ENUM,
    values:['Round 0','Round 1','Round 2','Round 3']

  },
  RegNo:{
    type:DataTypes.STRING(9),
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
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  tableName:'Rounds'
});

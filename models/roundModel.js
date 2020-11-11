const { DataTypes } = require("sequelize");
const validator = require('validator');

const Round=sequelize.define('Round',{
  roundNo:{
    primaryKey:true,
    type:DataTypes.ENUM,
    values:['0','1','2','3']
  },
  regNo:{
    type:DataTypes.STRING(9),
    primaryKey:true,
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
  suid:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  cuid:{
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  exception:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  },
  meetingCompleted:{
    type:DataTypes.BOOLEAN,
    defaultValue:false
  },
  domain:{
    type:DataTypes.STRING,
    primaryKey:true,
    validate:{
      notNull:true,
      notEmpty:true
    }
  },
  tableName:'Rounds'
});

module.exports=Round;

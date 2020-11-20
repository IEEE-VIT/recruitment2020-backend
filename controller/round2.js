const { Op } = require("sequelize");
const sequelize=require("sequelize");
const slotModel = require("../models/slotModel");
const questionModel = require("../models/questionModel");
const answerModel= require("../models/answerModel");
const roundModel = require("../models/roundModel");
const userModel=require("../models/userModel");

const response = require("../utils/genericResponse");

const getSlots= async (req,res)=>{

  var todayDate = new Date().toISOString().slice(0,10);
  var todayTime = new Date().toLocaleTimeString('it-IT',{hour12:false});

  slotModel.findAll({where:{
    [Op.or]:[{count:{[Op.lt]:20},roundNo:"2",date:{[Op.gt]:todayDate}}, {count:{[Op.lt]:20},roundNo:"2",date:todayDate,timeFrom:{[Op.gte]:todayTime}}]
  }})
  .then((slot)=>{
    if(slot=="")
    {
      response(res,true,"","All Slots Filled");
    }
    else
    {
      response(res,true,slot,"Slots Sent");
    }
  })
  .catch((err)=>{
    response(res,false,"",err.toString());
  })
};

const selectSlot= async (req,res)=>{

  userModel.findOne({where:{regNo:req.body.regNo}})
  .then((user)=>{
    slotModel.findOne({where:{suid:req.body.suid}})
    .then((slot)=>{
      if(slot.suid)
      {
        slotModel.update({count:slot.count+1},{where:{suid:req.body.suid}})
        .then((updatedSlot)=>{

          roundModel.create({
            roundNo:2,
            regNo: user.regNo,
            suid:slot.suid,
            status:"PR",
            domain:"MGMT"
            }).
            then((round)=>{
              response(res,true,round,"Added to Round 2");
            })
            .catch((err)=>{
                response(res,false,"",err.toString());
            })
        })
        .catch((err)=>{
            response(res,false,"",err.toString());
        })
      }
      else
      {
        response(res,false,"",err.toString());
      }
      }).
      catch((err)=>{
        response(res,false,"",err.toString());
      });
    })
    .catch((err)=>{
    response(res,false,"",err.toString());
  });
};

module.exports= { getSlots, selectSlot }
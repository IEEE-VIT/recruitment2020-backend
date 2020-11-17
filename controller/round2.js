const { Op } = require("sequelize");
const sequelize=require("sequelize");
const slotModel = require("../models/slotModel");
const questionModel = require("../models/questionModel");
const answerModel= require("../models/answerModel");
const roundModel = require("../models/roundModel");

const response = require("../utils/genericResponse");


const addSlot= async (req,res)=>{
  slotModel.create({
    suid: req.body.suid,
    date: req.body.date,
    roundNo:2,
    timeFrom: req.body.timeFrom,
    timeTo:req.body.timeTo,
    count:0
  })
  .then((ques)=>{
    response(res,true,ques,"Slot added");
  })
  .catch((err)=>{
    response(res,false,"",err.toString());
  })
};


const getSlots= async (req,res)=>{
  slotModel.findAll({where:{count:{[Op.lt]:20},roundNo:"2"}})
  .then((slot)=>{
    response(res,true,slot,"Slots Sent");
  })
  .catch((err)=>{
    response(res,false,"",err.toString());
  })
};

module.exports= { addSlot, getSlots }

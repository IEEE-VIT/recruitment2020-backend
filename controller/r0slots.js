const { Op } = require("sequelize");

const slotModel = require("../models/slotModel");
const response = require("../utils/genericResponse");

const addSlot= async (req,res)=>{
  await slotModel.create({
    suid: req.body.suid,
    date: req.body.date,
    timeRange: req.body.timeRange
  })
  .then((ques)=>{
    response(res,true,ques,"Slot added");
  })
  .catch((err)=>{
    response(res,false,"",err.toString());
  })
};


const getSlots= async (req,res)=>{

  await slotModel.findAll({where:{count:{[Op.lt]:5}}})
  .then((slot)=>{
    response(res,true,slot,"Slots Sent");
  })
  .catch((err)=>{
    response(res,false,"",err.toString());
  })
};

module.exports = { addSlot, getSlots };

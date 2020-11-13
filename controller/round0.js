const { Op } = require("sequelize");
const sequelize=require("sequelize");
const slotModel = require("../models/slotModel");
const questionModel = require("../models/questionModel");
const answerModel= require("../models/answerModel");
const roundModel = require("../models/roundModel");

const response = require("../utils/genericResponse");


const addQuestion= async (req,res)=>{
  questionModel.create({
    quid: req.body.quid,
    question: req.body.question,
    mandatory:req.body.mandatory
  })
  .then((ques)=>{
    response(res,true,ques,"Question added");
  })
  .catch((err)=>{
    response(res,false,"",err.toString());
  })
};


const getQuestions= async (req,res)=>
{
  // RETURNS 2 ARRAYS ONE WITH mandatory AND ONE WITH optional
  Promise.all(questionModel.findAll({where:{mandatory:false},order: sequelize.literal('random()'), limit: 1 }), questionModel.findAll({where:{mandatory:true}}))
  .then((teaser) => {
    response(res,true,teaser,"Questions Sent");
    })
    .catch((err)=>{
      response(res,false,"",err.toString());
    })
  };


const addSlot= async (req,res)=>{
  slotModel.create({
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
  slotModel.findAll({where:{count:{[Op.lt]:5}}})
  .then((slot)=>{
    response(res,true,slot,"Slots Sent");
  })
  .catch((err)=>{
    response(res,false,"",err.toString());
  })
};

const userForm= async (req,res)=>{
  req.body.questions.forEach((item, i) => {
    answerModel.create({
      regNo:req.body.regNo,
      quid:req.body.questions[i].quid,
      answer:req.body.questions[i].answer
    })
    .then((ans)=>{
      console.log("Question Added");
    })
    .catch((err)=>{
      console.log(err);
    })
  });
  slotModel.findOne({where:{date:req.body.date,timeRange:req.body.timeRange}})
  .then((slot)=>{
    roundModel.create({
      roundNo:0,
      regNo: req.body.regNo,
      suid:slot.suid,
      status:"PR",
      domain:req.body.domain
      }).
      then((round)=>{
        response(res,true,round,"Added to Round 0");
      })
      .catch((err)=>{
          response(res,false,"",err.toString());
      })
    }).
    catch((err)=>{
      response(res,false,"",err.toString());
    });
};



module.exports = { addQuestion, getQuestions, addSlot, getSlots, userForm };

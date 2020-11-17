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
  Promise.all([questionModel.findAll({where:{mandatory:false},order: sequelize.literal('random()'), limit: 1 }), questionModel.findAll({where:{mandatory:true}})])
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
    roundNo:1,
    date: req.body.date,
    timeFrom: req.body.timeFrom,
    timeTo:req.body.timeTo
  })
  .then((ques)=>{
    response(res,true,ques,"Slot added");
  })
  .catch((err)=>{
    response(res,false,"",err.toString());
  })
};


const getSlots= async (req,res)=>{
  slotModel.findAll({where:{count:{[Op.lt]:5},roundNo:"1"}})
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
  slotModel.findOne({where:{date:req.body.date,timeFrom:req.body.timeFrom,timeTo:req.body.timeTo}})
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

const verifyslotTime= async (req,res)=>{

  // NEED TO CHECK IF IT WORKS FOR DIFFERENT TIME ZONES TOO
  // AS OF NOW IT WORKS IF THE TIME SLOTS AND THE SERVER CLOCK ARE SYNCED

  roundModel.findOne({where:{regNo:req.body.regNo}})
  .then((data)=>{
    slotModel.findOne({where:{suid:data.suid}})
    .then((slot)=>{
      var todayDate = new Date().toISOString().slice(0,10);
      var todayTime = new Date().toLocaleTimeString('it-IT',{hour12:false});

      // console.log(todayDate);
      // console.log(todayTime);
      // console.log(slot.timeFrom);
      // console.log(slot.timeTo);

      if(todayDate==slot.date && todayTime>=slot.timeFrom && todayTime<=slot.timeTo)
      {
        response(res,true,true,"Slot Time Verified");
      }
      else
      {
        response(res,true,false,"Slot Time Incorrect");
      }

    })
    .catch((err)=>{
        response(res,false,"",err.toString());
    })
  })
  .catch((err)=>{
      response(res,false,"",err.toString());
  })
};

module.exports = { addQuestion, getQuestions, addSlot, getSlots, userForm, verifyslotTime };

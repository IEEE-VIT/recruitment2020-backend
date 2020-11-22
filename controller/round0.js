const { Op } = require("sequelize");
const sequelize=require("sequelize");
const slotModel = require("../models/slotModel");
const questionModel = require("../models/questionModel");
const answerModel= require("../models/answerModel");
const roundModel = require("../models/roundModel");
const userModel=require("../models/userModel");

const response = require("../utils/genericResponse");

const getQuestions= async (req,res)=>
{
  const randomQuestionToBeSent=3;
  questionModel.findAll({where:{mandatory:false},order: sequelize.literal('random()'), limit: randomQuestionToBeSent })
  .then((ques) => {
    questionModel.findAll({where:{mandatory:true}})
    .then((manQues)=>{
      var all=manQues.concat(ques);
      response(res,true,all,"Questions Sent");
    })
    .catch((err)=>{
      response(res,false,"",err.toString());
    })
  })
  .catch((err)=>{
      response(res,false,"",err.toString());
    })
}

const getSlots= async (req,res)=>{
  var todayDate = new Date().toISOString().slice(0,10);
  var todayTime = new Date().toLocaleTimeString('it-IT',{hour12:false});

  slotModel.findAll({where:{
    [Op.or]:[{count:{[Op.lt]:5},roundNo:"1",date:{[Op.gt]:todayDate}}, {count:{[Op.lt]:5},roundNo:"1",date:todayDate,timeFrom:{[Op.gte]:todayTime}}]
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

const userForm= async (req,res)=>{
  userModel.findOne({where:{regNo:req.body.regNo}})
  .then((user)=>{
    slotModel.findOne({where:{suid:req.body.suid}})
    .then((slot)=>{
      if(slot.suid)
      {
        slotModel.update({count:slot.count+1},{where:{suid:req.body.suid}})
        .then((updatedSlot)=>{

          for (var i in req.body.questions) {
            answerModel.create({
                regNo:user.regNo,
                quid:req.body.questions[i].quid,
                answer:req.body.questions[i].answer
              })
          };

          roundModel.create({
            roundNo:0,
            regNo: user.regNo,
            suid:slot.suid,
            status:"PR",
            domain:"DEFAULT"
            }).
            then((round)=>{
              response(res,true,round,"Added to Round 0");
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

module.exports = { getQuestions, getSlots, userForm, verifyslotTime };

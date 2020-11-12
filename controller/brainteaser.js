const btModel = require("../models/teaserQuestionModel");
const response = require("../utils/genericResponse");

const addQuestion= async (req,res)=>{
  await btModel.create({
    quid: req.body.quid,
    question: req.body.question
  })
  .then((ques)=>{
    response(res,true,ques,"Question added");
  })
  .catch((err)=>{
    response(res,false,"",err.toString());
  })
};


const getQuestions= async (req,res)=>{
  var n=2;
  await btModel.findAll({limit:n})
  .then((teaser)=>{
    response(res,true,teaser,"Questions Sent");
  })
  .catch((err)=>{
    response(res,false,"",err.toString());
  })
};

module.exports = { addQuestion, getQuestions };

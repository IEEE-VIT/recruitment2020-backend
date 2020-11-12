const btModel = require("../models/teaserQuestionModel");
const response = require("../utils/genericResponse");

const getQuestions= async (req,res)=>{
  res.send('hello');
};

module.exports = { getQuestions };

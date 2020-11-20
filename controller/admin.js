const { Op } = require('sequelize');
const adminModel = require("../models/adminModel");
const roundModel=require("../models/roundModel");
const userModel=require("../models/userModel");
const slotModel=require("../models/slotModel");
const commentModel=require("../models/commentModel");

const response = require("../utils/genericResponse");


const readAdmin=async (req,res)=>{
  adminModel.findOne({where:{auid:req.query.auid}})
  .then((admin)=>{
    if(admin==null)
    {
      response(res,true,admin,"Admin ID invalid");
    }
    else {
      response(res,true,admin,"Admin found");
    }
  })
  .catch((err)=>{
    response(res,false,"",err.toString());
  })
};

const updateAdmin=async (req,res)=>{
  adminModel.update(
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        meetLink: req.body.meetLink
      },
      {where:{auid:req.body.auid}}
    )
    .then(result => {
        if(result == 0 ){
            response(res, true, result, "Admin ID invalid");
        }else{
            response(res, true, result, "Admin updated successfully");
        }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });

};

const fetchTechRound2Candidates=async (req,res)=>{
  roundModel
    .findAll({
      attributes: ["regNo"],
      include: userModel,
      where: {
        roundNo: "2",
        meetingCompleted: false,
        domain: "TECH"
      },
    })
    .then(result => {
      if (result.length === 0 ) {
        response(res, true, null, "No Ready candidates for Tech Round 2 found");
      } else {
        response(res, true, result, "Ready candidates for Tech Round 2 found");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const fetchMgmtRound2Candidates=async (req,res)=>{
  slotModel.findOne({where:{suid:req.query.suid}})
  .then((slot)=>{
    roundModel
      .findAll({
        attributes: ["regNo"],
        include: userModel,
        where: {
          roundNo: "2",
          meetingCompleted: false,
          domain: "MGMT",
          suid:slot.suid
        },
      })
      .then(result => {
        if (result.length === 0 ) {
          response(res, true, result, "No Ready candidates for Mgmt Round 2 found");
        } else {
          response(res, true, result, "Ready candidates for Mgmt Round 2 found");
        }
      })
      .catch((err) => {
        response(res, false, "", err.toString());
      });
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const fetchAllAdmins= async (req,res)=>{
    adminModel.findAll({attributes: {exclude:'password'}})
  .then((admins)=>{
    response(res,true,admins,"Admins Found");
  })
  .catch((err)=>{
    response(res, false, "", err.toString());
  })
}

const fetchExceptions= async (req,res)=>{
  roundModel.findAll({where:{roundNo:req.query.roundNo,regNo:req.query.regNo, exception:{[Op.ne]:null}}})
  .then((data)=>{
    if(data.length==0)
    {
      response(res,true,null,"No Exception Found");
    }
    else {
      response(res,true,data,"Exceptions Sent");
    }
  })
  .catch((err)=>{
    response(res, false, "", err.toString());
  })
};

const resolveExceptions=async(req,res)=>{
  roundModel.update({
    exception:null
  },{where:{roundNo:req.body.roundNo , regNo:req.body.regNo, domain:req.body.domain}})
  .then((data)=>{
    if(data==1)
    {
      commentModel.create({
        cuid:req.body.cuid,
        regNo:req.body.regNo,
        auid:req.body.auid,
        comment:req.body.comment
      })
      .then((comment)=>{
        roundModel.update({
          cuid:comment.cuid
        },{where:{roundNo:req.body.roundNo , regNo:req.body.regNo, domain:req.body.domain}})
        .then((data)=>{
            response(res,true,data,"Exception Resolved");
        })
        .catch((err)=>{
          response(res, false, "", err.toString());
        })
      })
      .catch((err)=>{
        response(res, false, "", err.toString());
      })
    }
    else
    {
      response(res, false, "", "Exception not Found");
    }
  })
  .catch((err)=>{
    response(res, false, "", err.toString());
  })
};

module.exports={ readAdmin, updateAdmin, fetchTechRound2Candidates, fetchMgmtRound2Candidates, fetchAllAdmins, fetchExceptions, resolveExceptions }

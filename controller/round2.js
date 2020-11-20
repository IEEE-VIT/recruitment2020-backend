const { Op } = require("sequelize");
const sequelize = require("sequelize");
const slotModel = require("../models/slotModel");
const questionModel = require("../models/questionModel");
const answerModel = require("../models/answerModel");
const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const adminModel = require("../models//adminModel");

const response = require("../utils/genericResponse");

const getSlots = async (req, res) => {
  var todayDate = new Date().toISOString().slice(0, 10);
  var todayTime = new Date().toLocaleTimeString("it-IT", { hour12: false });

  slotModel
    .findAll({
      where: {
        [Op.or]: [
          {
            count: { [Op.lt]: 20 },
            roundNo: "2",
            date: { [Op.gt]: todayDate },
          },
          {
            count: { [Op.lt]: 20 },
            roundNo: "2",
            date: todayDate,
            timeFrom: { [Op.gte]: todayTime },
          },
        ],
      },
    })
    .then((slot) => {
      if (slot == "") {
        response(res, true, "", "All Slots Filled");
      } else {
        response(res, true, slot, "Slots Sent");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const selectSlot = async (req, res) => {
  userModel
    .findOne({ where: { regNo: req.body.regNo } })
    .then((user) => {
      slotModel
        .findOne({ where: { suid: req.body.suid } })
        .then((slot) => {
          if (slot.suid) {
            slotModel
              .update(
                { count: slot.count + 1 },
                { where: { suid: req.body.suid } }
              )
              .then((updatedSlot) => {
                roundModel
                  .create({
                    roundNo: 2,
                    regNo: user.regNo,
                    suid: slot.suid,
                    status: "PR",
                    domain: "MGMT",
                  })
                  .then((round) => {
                    response(res, true, round, "Added to Round 2");
                  })
                  .catch((err) => {
                    response(res, false, "", err.toString());
                  });
              })
              .catch((err) => {
                response(res, false, "", err.toString());
              });
          } else {
            response(res, false, "", err.toString());
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

const fetchGdp = (req, res) => {
  roundModel
    .findOne({
      include: slotModel,
      where: {
        roundNo: "2",
        regNo: req.body.regNo,
        domain: "MGMT",
      },
    })
    .then((result) => {
      console.log(result);
      response(res, true, result.Slot, "Found GDP");
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const fetchGda = async (req, res) => {
  roundModel
    .findOne({
      include: adminModel,
      where: {
        roundNo: "2",
        regNo: req.body.regNo,
        domain: "MGMT",
      },
    })
    .then((resu0) => {
      console.log(result);
      response(res, true, result.Admin, "Found GDA");
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const setGdp = async (req, res) => {
  slotModel.update(
    {
      gdpLink: req.body.gdpLink,
    },
    {
      where: {
        suid: req.body.suid,
      },
    }
  )
  .then(data =>{
      if(data > 0){
        response(res, true, "", "GDP Updated Successfully!");
      }else{
        response(res, true, "", "Error updating GDP!");
      }
  }).catch(err =>{
    response(res, false, "", err.toString());
  })
}

module.exports = { setGdp, getSlots, selectSlot, fetchGda, fetchGdp };

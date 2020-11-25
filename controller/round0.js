/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const slotModel = require("../models/slotModel");
const questionModel = require("../models/questionModel");
const answerModel = require("../models/answerModel");
const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const db = require("../utils/db");

const response = require("../utils/genericResponse");
const constants = require("../utils/constants");

const getQuestions = async (req, res) => {
  const randomQuestionToBeSent = 3;
  questionModel
    .findAll({
      where: { mandatory: false },
      order: sequelize.literal("random()"),
      limit: randomQuestionToBeSent,
    })
    .then((ques) => {
      questionModel
        .findAll({ where: { mandatory: true } })
        .then((manQues) => {
          const all = manQues.concat(ques);
          response(res, true, all, "Questions Sent");
        })
        .catch((err) => {
          response(res, false, "", err.toString());
        });
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const getSlots = async (req, res) => {
  const todayDate = new Date().toISOString().slice(0, 10);
  const todayTime = new Date().toLocaleTimeString("it-IT", { hour12: false });

  slotModel
    .findAll({
      where: {
        [Op.or]: [
          { count: { [Op.lt]: 5 }, roundNo: "1", date: { [Op.gt]: todayDate } },
          {
            count: { [Op.lt]: 5 },
            roundNo: "1",
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

const userForm = async (req, res) => {
  try {
    const result = await db.transaction(async (t) => {
      const user = await userModel.findOne(
        { where: { regNo: req.body.regNo } },
        { transaction: t }
      );
      if (user == null) {
        throw new Error("Invalid Registration Number");
      }

      const slot = await slotModel.findOne(
        { where: { suid: req.body.suid } },
        { transaction: t }
      );
      if (slot == null) {
        throw new Error("Invalid Slot");
      }
      for (let i = 0; i < req.body.questions.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const alreadyAnswered = await answerModel.findOne({
          where: {
            regNo: user.regNo,
            quid: req.body.questions[i].quid,
          },
        });

        if (alreadyAnswered !== null) {
          throw new Error("Question already answered");
        }

        // eslint-disable-next-line no-await-in-loop
        await answerModel.create(
          {
            regNo: user.regNo,
            quid: req.body.questions[i].quid,
            answer: req.body.questions[i].answer,
          },
          { transaction: t }
        );
      }

      await userModel.update(
        {
          coreDomains: req.body.coreDomains,
          specificDomains: req.body.specificDomains,
        },
        { where: { regNo: req.body.regNo } }
      );

      const round = await roundModel.create(
        {
          roundNo: 0,
          regNo: user.regNo,
          suid: slot.suid,
          status: "PR",
          coreDomain: constants.Unknown,
          specificDomain: constants.Unknown,
        },
        { transaction: t }
      );

      let slotCount = slot.count;
      slotCount += 1;

      await slotModel.update(
        { count: slotCount },
        { where: { suid: req.body.suid } },
        { transaction: t }
      );
      return round;
    });
    response(res, true, result, "Added to Round 0");
  } catch (error) {
    response(res, false, "", error.toString());
  }
};

const verifyslotTime = async (req, res) => {
  // NEED TO CHECK IF IT WORKS FOR DIFFERENT TIME ZONES TOO
  // AS OF NOW IT WORKS IF THE TIME SLOTS AND THE SERVER CLOCK ARE SYNCED

  roundModel
    .findOne({ where: { regNo: req.body.regNo } })
    .then((data) => {
      slotModel
        .findOne({ where: { suid: data.suid } })
        .then((slot) => {
          const todayDate = new Date().toISOString().slice(0, 10);
          const todayTime = new Date().toLocaleTimeString("it-IT", {
            hour12: false,
          });

          // console.log(todayDate);
          // console.log(todayTime);
          // console.log(slot.timeFrom);
          // console.log(slot.timeTo);

          if (
            todayDate == slot.date &&
            todayTime >= slot.timeFrom &&
            todayTime <= slot.timeTo
          ) {
            response(res, true, true, "Slot Time Verified");
          } else {
            response(res, true, false, "Slot Time Incorrect");
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

module.exports = {
  getQuestions,
  getSlots,
  userForm,
  verifyslotTime,
};

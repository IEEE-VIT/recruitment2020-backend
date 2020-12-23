/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const moment = require("moment-timezone");
const firebase = require("firebase-admin");
const slotModel = require("../../models/slotModel");
const slotLimitModel = require("../../models/slotLimitModel");
const questionModel = require("../../models/questionModel");
const answerModel = require("../../models/answerModel");
const roundModel = require("../../models/roundModel");
const userModel = require("../../models/userModel");
const db = require("../../utils/db");
const response = require("../../utils/genericResponse");
const constants = require("../../utils/constants");
const logger = require("../../configs/winston");
const { firebaseDb } = require("../../utils/firebase");

moment.tz.setDefault("Asia/Calcutta");

const whyIEEE = async (req, res) => {
  const data = {
    regNo: req.user.regNo,
    email: req.user.email,
    whyIEEE: req.body.answer,
    created: firebase.firestore.Timestamp.now(),
  };
  await firebaseDb
    .collection("prod")
    .doc(req.user.regNo)
    .set(data)
    .then(() => {
      response(res, true, true, "Question Answered");
    })
    .catch((err) => {
      logger.error(`Failure to answerWhyIEEE due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const filledWhyIEEE = async (req, res) => {
  await firebaseDb
    .collection("prod")
    .where("regNo", "==", req.user.regNo)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        response(res, true, false, "Question Not Yet Answered");
      } else {
        response(res, true, true, "Question Already Answered");
      }
    })
    .catch((err) => {
      logger.error(`Failure to answerWhyIEEE due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const getQuestions = async (req, res) => {
  questionModel
    .findAll({
      where: { mandatory: false },
      order: sequelize.literal("random()"),
      limit: constants.NonMandatoryQuesions,
    })
    .then((ques) => {
      questionModel
        .findAll({ where: { mandatory: true } })
        .then((manQues) => {
          const all = manQues.concat(ques);
          if (all.length == 0) {
            response(res, true, all, "No Questions Found");
          } else {
            response(res, true, all, "Questions Sent");
          }
        })
        .catch((err) => {
          logger.error(`Failure to getQuestions due to ${err}`);
          response(res, false, "", err.toString());
        });
    })
    .catch((err) => {
      logger.error(`Failure to getQuestions due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const getSlots = async (req, res) => {
  const todayDate = moment()
    .add(constants.showSlotsafterHours, "hours")
    .format("YYYY-MM-DD");
  const todayTime = moment()
    .add(constants.showSlotsafterHours, "hours")
    .format("HH:mm:ss");

  await slotLimitModel
    .findOne({ where: { roundNo: "1" } })
    .then((slotLimit) => {
      if (slotLimit === null) {
        throw new Error("Slots will be sent asap the limit is set");
      } else {
        slotModel
          .findAll({
            where: {
              [Op.or]: [
                {
                  count: { [Op.lt]: slotLimit.maxCandidates },
                  roundNo: "1",
                  date: { [Op.gt]: todayDate },
                },
                {
                  count: { [Op.lt]: slotLimit.maxCandidates },
                  roundNo: "1",
                  date: todayDate,
                  timeFrom: { [Op.gte]: todayTime },
                },
              ],
            },
            order: [
              ["date", "ASC"],
              ["timeFrom", "ASC"],
            ],
          })
          .then((slots) => {
            if (slots == "") {
              response(res, true, "", "No Valid Slot available");
            } else {
              response(res, true, slots, "Slots Sent");
            }
          })
          .catch((err) => {
            logger.error(`Failure to getSlots due to ${err}`);
            response(res, false, "", err.toString());
          });
      }
    });
};

const getAllRound1Slots = async (req, res) => {
  const todayDate = moment()
    .add(constants.showSlotsafterHours, "hours")
    .format("YYYY-MM-DD");
  const todayTime = moment()
    .add(constants.showSlotsafterHours, "hours")
    .format("HH:mm:ss");

  slotModel
    .findAll({
      where: {
        [Op.or]: [
          {
            roundNo: "1",
            date: { [Op.gt]: todayDate },
          },
          {
            roundNo: "1",
            date: todayDate,
            timeFrom: { [Op.gte]: todayTime },
          },
        ],
      },
      order: [
        ["date", "ASC"],
        ["timeFrom", "ASC"],
      ],
    })
    .then(async (slots) => {
      const newSlots = slots;

      const slotLimit = await slotLimitModel.findOne({
        where: { roundNo: "1" },
      });

      Object.keys(newSlots).forEach((slot) => {
        newSlots[slot] = newSlots[slot].toJSON();
        const currentSlot = newSlots[slot];
        if (currentSlot.count >= slotLimit.maxCandidates) {
          currentSlot.filled = true;
        } else {
          currentSlot.filled = false;
        }
      });

      if (slots == "") {
        response(res, true, "", "No Valid Slot available");
      } else {
        response(res, true, slots, "Slots Sent");
      }
    })
    .catch((err) => {
      logger.error(`Failure to getSlots due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const userForm = async (req, res) => {
  try {
    const result = await db.transaction(async (t) => {
      const user = await userModel.findOne(
        { where: { regNo: req.user.regNo } },
        { transaction: t }
      );
      if (user == null) {
        throw new Error("Invalid Registration Number");
      }
      const userNumber = await userModel.findOne(
        { where: { phoneNo: req.body.phoneNo } },
        { transaction: t }
      );

      if (userNumber) {
        throw new Error("Phone Number already exists");
      }

      const slot = await slotModel.findOne(
        { where: { suid: req.body.suid, roundNo: "1" } },
        { transaction: t }
      );
      if (slot == null) {
        throw new Error("Invalid Slot");
      }

      const roundForm = await roundModel.findOne({
        where: {
          [Op.or]: [
            {
              regNo: req.user.regNo,
              roundNo: "0",
            },
            {
              regNo: req.user.regNo,
              roundNo: "1",
            },
          ],
        },
      });

      if (roundForm !== null) {
        throw new Error("Round 0 form already filled");
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
          name: req.body.name,
          phoneNo: req.body.phoneNo,
          coreDomains: req.body.coreDomains,
          specificDomains: req.body.specificDomains,
        },
        { where: { regNo: req.user.regNo } }
      );

      const round = await roundModel.create(
        {
          roundNo: 0,
          regNo: user.regNo,
          suid: slot.suid,
          status: constants.PendingReview,
          coreDomain: constants.Unknown,
          specificDomain: constants.Unknown,
        },
        { transaction: t }
      );

      let slotCount = slot.count;
      slotCount += 1;

      await slotModel.update(
        { count: slotCount },
        { where: { suid: req.body.suid, roundNo: "1" } },
        { transaction: t }
      );
      return round;
    });
    response(res, true, result, "Added to Round 0");
  } catch (err) {
    logger.error(`Failure to userForm due to ${err}`);
    response(res, false, "", "Something went wrong! Please try again");
  }
};

const verifyslotTime = async (req, res) => {
  roundModel
    .findOne({ where: { regNo: req.user.regNo, roundNo: "0" } })
    .then((data) => {
      if (data == null) {
        throw new Error("Invalid Registration Number in the given round");
      }
      slotModel
        .findOne({ where: { suid: data.suid, roundNo: "1" } })
        .then((slot) => {
          if (slot == null) {
            throw new Error("Invalid Slot");
          }
          const todayDate = moment().format("DD MMM");
          const todayTime = moment().format("HH:mm");
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
          logger.error(`Failure to verifyslotTime due to ${err}`);
          response(res, false, "", err.toString());
        });
    })
    .catch((err) => {
      logger.error(`Failure to verifyslotTime due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const filledFormBoolean = async (req, res) => {
  roundModel
    .findOne({
      where: {
        [Op.or]: [
          {
            regNo: req.user.regNo,
            roundNo: "0",
          },
          {
            regNo: req.user.regNo,
            roundNo: "1",
          },
        ],
      },
    })
    .then((roundData) => {
      if (roundData === null) {
        response(res, true, false, "Round0 form not filled");
      } else {
        response(res, true, true, "Round0 form filled");
      }
    })
    .catch((err) => {
      logger.error(`Failure to filledFormBoolean due to ${err}`);
      response(res, false, "", err.toString());
    });
};

module.exports = {
  getQuestions,
  getSlots,
  getAllRound1Slots,
  userForm,
  verifyslotTime,
  filledFormBoolean,
  whyIEEE,
  filledWhyIEEE,
};

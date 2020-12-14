/* eslint-disable eqeqeq */
const moment = require("moment-timezone");
const userModel = require("../../models/userModel");
const deadlineModel = require("../../models/deadlineModel");
const roundModel = require("../../models/roundModel");
const slotModel = require("../../models/slotModel");
const response = require("../../utils/genericResponse");
const constants = require("../../utils/constants");
const logger = require("../../configs/winston");

moment.tz.setDefault("Asia/Calcutta");

const userStatus = async (req, res) => {
  roundModel
    .findAll({
      order: ["roundNo"],
      where: {
        regNo: req.user.regNo,
      },
    })
    .then((data) => {
      const latestRound = data[0].roundNo;
      const resultformed = {};
      const round2Data = [];
      resultformed.latestRound = latestRound;
      switch (latestRound) {
        case "2":
          data.forEach((roundData) => {
            if (roundData.roundNo === "2") {
              round2Data.push(roundData);
            }
          });
          resultformed.roundsData = round2Data;
          break;
        case "1":
        case "0":
          resultformed.roundData = data;
          break;
        case "3":
          resultformed.roundData = [];
          break;
        default:
          resultformed.latestRound = "Unkown Round";
      }
      if (data.length === 0) {
        response(res, true, data, "User does not exists");
      } else {
        response(res, true, resultformed, "History found for the candidate!");
      }
    })
    .catch((err) => {
      logger.error(`Failure to getUserStatus due to ${err}`);
      response(res, false, "", err.toString());
    });
};
const getResults = async (req, res) => {
  const todayDate = moment().format("YYYY-MM-DD");
  const todayTime = moment().format("HH:mm:ss");

  await deadlineModel
    .findOne({ where: { roundNo: req.query.roundNo } })
    .then((roundDeadline) => {
      if (roundDeadline === null) {
        throw new Error("Deadline not yet set");
      }
      if (
        todayDate > roundDeadline.date ||
        (todayDate == roundDeadline.date && todayTime >= roundDeadline.time)
      ) {
        roundModel
          .findAll({
            where: { roundNo: req.query.roundNo, regNo: req.user.regNo },
          })
          .then((roundData) => {
            if (roundData == "") {
              throw new Error("User not found in given round");
            }
            response(res, true, roundData, "Results are out");
          })
          .catch((err) => {
            logger.error(`Failure to getResults due to ${err}`);
            response(res, false, "", err.toString());
          });
      } else {
        roundModel
          .findAll({
            attributes: { exclude: ["status"] },
            where: { roundNo: req.query.roundNo, regNo: req.user.regNo },
          })
          .then((roundData) => {
            if (roundData == "") {
              throw new Error("User not found in given round");
            }
            response(res, true, roundData, "Results are not out yet");
          })
          .catch((err) => {
            logger.error(`Failure to getResults due to ${err}`);
            response(res, false, "", err.toString());
          });
      }
    })
    .catch((err) => {
      logger.error(`Failure to getResults due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const dashboard = async (req, res) => {
  const { regNo } = req.user;
  try {
    const qualifiedRounds = [];
    const slots = {};
    const domainAdder = (roundData) => {
      if (
        roundData.status === constants.AcceptedReview &&
        !qualifiedRounds.includes(roundData.coreDomain)
      ) {
        qualifiedRounds.push(roundData.domain);
      }
    };

    const resultData = {
      round0Status: false,
      round1Status: constants.PendingReview,
      round2Status: constants.PendingReview,
      round3Status: constants.PendingReview,
      qualifiedRounds: [],
      slots: {
        round1: {},
        round2: {},
        round3: {},
      },
      user: {},
    };
    const userData = await userModel.findOne({
      where: { regNo },
    });
    resultData.user = userData;
    const roundModelData = await roundModel.findAll({
      include: slotModel,
      order: ["roundNo"],
      where: { regNo },
    });
    if (roundModelData.length === 0) {
      response(res, true, resultData, "Did not submit round0 form");
      return;
    }
    roundModelData.map((roundData) => {
      switch (roundData.roundNo) {
        case "0":
          resultData.round0Status = true;
          domainAdder(roundData);
          slots.round1 = roundData.Slot == null ? false : roundData.Slot;
          break;
        case "1":
          resultData.round0Status = true;
          resultData.round1Status = roundData.status;
          domainAdder(roundData);
          slots.round1 = roundData.Slot == null ? false : roundData.Slot;
          break;
        case "2":
          resultData.round0Status = true;
          resultData.round2Status = roundData.status;
          domainAdder(roundData);
          slots.round2 = roundData.Slot == null ? false : roundData.Slot;
          break;
        case "3":
          resultData.round0Status = true;
          resultData.round3Status = roundData.status;
          domainAdder(roundData);
          slots.round3 = roundData.Slot == null ? false : roundData.Slot;
          break;
        default:
          break;
      }
      return roundData;
    });
    resultData.slots = slots;
    resultData.qualifiedRounds = qualifiedRounds;
    response(res, true, resultData, "User details");
  } catch (error) {
    response(res, false, "", error.toString());
  }
};

module.exports = {
  userStatus,
  getResults,
  dashboard,
};

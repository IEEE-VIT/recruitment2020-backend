/* eslint-disable eqeqeq */
const moment = require("moment-timezone");
const userModel = require("../../models/userModel");
const deadlineModel = require("../../models/deadlineModel");
const roundModel = require("../../models/roundModel");
const slotModel = require("../../models/slotModel");
const updatesModel = require("../../models/updateModel");
const response = require("../../utils/genericResponse");
const constants = require("../../utils/constants");
const logger = require("../../configs/winston");

moment.tz.setDefault("Asia/Calcutta");

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

    const resultsTimeCheck = async (roundNo) => {
      const todayDate = moment().format("YYYY-MM-DD");
      const todayTime = moment().format("HH:mm:ss");
      const resultsTimeChecker = await deadlineModel
        .findOne({ where: { roundNo } })
        .then((roundDeadline) => {
          if (
            todayDate > roundDeadline.date ||
            (todayDate == roundDeadline.date && todayTime >= roundDeadline.time)
          ) {
            return true;
          }
          return false;
        });
      return resultsTimeChecker;
    };

    const missedSlot = (meetingCompleted, timeTo, date) => {
      const todayDate = moment().format("DD MMM");
      const todayTime = moment().format("HH:mm");
      if (
        !meetingCompleted &&
        (todayDate > date || (todayDate == date && todayTime >= timeTo))
      ) {
        return true;
      }
      return false;
    };

    const resultData = {
      round0Status: false,
      round1Status: constants.Locked,
      round2MgmtStatus: constants.Locked,
      round2NonMgmtStatus: constants.Locked,
      round3Status: constants.Locked,
      qualifiedRounds: [],
      slots: {
        round1: {},
        round2Mgmt: {},
        round2NonMgmt: {},
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

    roundModelData.map(async (roundData) => {
      switch (roundData.roundNo) {
        case "0":
          resultData.round0Status = true;

          resultData.round1Status = constants.Ready;
          domainAdder(roundData);
          slots.round1 = roundData.Slot == null ? false : roundData.Slot;
          break;

        case "1":
          resultData.round0Status = true;
          if (roundData.Slot === null) {
            resultData.round1Status = constants.NoSlot;
            slots.round1 = null;
          } else if (
            missedSlot(
              roundData.meetingCompleted,
              roundData.Slot.timeTo,
              roundData.Slot.date
            )
          ) {
            resultData.round1Status = constants.Missed;
            slots.round1 = roundData.Slot;
          } else if (roundData.meetingCompleted === false) {
            resultData.round1Status = constants.Ready;
            slots.round1 = roundData.Slot;
          } else {
            const isResultTime = await resultsTimeCheck("1");
            if (isResultTime) {
              resultData.round1Status = roundData.status;
            } else {
              resultData.round1Status = constants.PendingReview;
            }
            slots.round1 = roundData.Slot;
          }
          domainAdder(roundData);
          break;

        case "2":
          resultData.round1Status = constants.AcceptedReview;

          if (
            roundData.coreDomain === constants.Tech ||
            roundData.coreDomain === constants.Dsn
          ) {
            resultData.round2NonMgmtStatus = true;

            if (roundData.Slot === null) {
              resultData.round2NonMgmtStatus = constants.Ready;
              slots.round2NonMgmt = null;
            } else if (
              missedSlot(
                roundData.meetingCompleted,
                roundData.Slot.timeTo,
                roundData.Slot.date
              )
            ) {
              resultData.round2NonMgmtStatus = constants.Missed;
              slots.round2NonMgmt = roundData.Slot;
            } else if (roundData.meetingCompleted === false) {
              resultData.round2NonMgmtStatus = constants.Ready;
              slots.round2NonMgmt = roundData.Slot;
            } else {
              const isResultTime = await resultsTimeCheck("2");
              if (isResultTime) {
                resultData.round2NonMgmtStatus = roundData.status;
              } else {
                resultData.round2NonMgmtStatus = constants.PendingReview;
              }

              slots.round2NonMgmt = roundData.Slot;
            }
          }

          if (roundData.coreDomain == constants.Mgmt) {
            resultData.round2MgmtStatus = true;
            if (roundData.Slot === null) {
              resultData.round2MgmtStatus = constants.NoSlot;
              slots.round2Mgmt = null;
            } else if (
              missedSlot(
                roundData.meetingCompleted,
                roundData.Slot.timeTo,
                roundData.Slot.date
              )
            ) {
              resultData.round2MgmtStatus = constants.Missed;
              slots.round2Mgmt = roundData.Slot;
            } else if (roundData.meetingCompleted === false) {
              resultData.round2MgmtStatus = constants.Ready;
              slots.round2Mgmt = roundData.Slot;
            } else {
              const isResultTime = await resultsTimeCheck("2");
              if (isResultTime) {
                resultData.round2MgmtStatus = roundData.status;
              } else {
                resultData.round2MgmtStatus = constants.PendingReview;
              }
              slots.round2Mgmt = roundData.Slot;
            }
          }
          domainAdder(roundData);
          break;

        case "3":
          resultData.round0Status = true;
          resultData.round1Status = constants.AcceptedReview;

          if (roundData.coreDomain == constants.Mgmt) {
            resultData.round2MgmtStatus = constants.AcceptedReview;
          } else {
            resultData.round2NonMgmtStatus = constants.AcceptedReview;
          }

          if (roundData.Slot === null) {
            resultData.round3Status = constants.Ready;
            slots.round3 = null;
          } else if (
            missedSlot(
              roundData.meetingCompleted,
              roundData.Slot.timeTo,
              roundData.Slot.date
            )
          ) {
            resultData.round3Status = constants.Missed;
            slots.round3 = roundData.Slot;
          } else if (roundData.meetingCompleted === false) {
            resultData.round3Status = constants.Ready;
            slots.round3 = roundData.Slot;
          } else {
            const isResultTime = await resultsTimeCheck("3");
            if (isResultTime) {
              resultData.round3Status = roundData.status;
            } else {
              resultData.round3Status = constants.PendingReview;
            }
            slots.round3 = roundData.Slot;
          }
          domainAdder(roundData);
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

const getUpdates = async (req, res) => {
  updatesModel
    .findAll({
      order: [
        ["date", "DESC"],
        ["time", "DESC"],
      ],
    })
    .then((updates) => {
      if (updates.length === 0) {
        response(res, true, false, "No Updates Available");
      } else {
        response(res, true, updates, "All updates sent");
      }
    })
    .catch((err) => {
      logger.error(`Failure to getUpdates due to ${err}`);
      response(res, false, "", err.toString());
    });
};

module.exports = {
  getResults,
  dashboard,
  getUpdates,
};

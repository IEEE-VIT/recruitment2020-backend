/* eslint-disable eqeqeq */
const moment = require("moment-timezone");
const { Op } = require("sequelize");
const userModel = require("../../models/userModel");
const deadlineModel = require("../../models/deadlineModel");
const roundModel = require("../../models/roundModel");
const slotModel = require("../../models/slotModel");
const updatesModel = require("../../models/updateModel");
const projectModel = require("../../models/projectModel");
const adminModel = require("../../models/adminModel");
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
    const todayDate = moment().format("DD MMM");
    const todayTime = moment().format("HH:mm");

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
      if (
        !meetingCompleted &&
        (todayDate > date || (todayDate == date && todayTime >= timeTo))
      ) {
        return true;
      }
      return false;
    };

    const checkRound2Time = async (userRegNo) => {
      const finalData = await roundModel
        .findOne({
          where: {
            regNo: userRegNo,
            roundNo: "2",
            coreDomain: { [Op.or]: [constants.Tech, constants.Dsn] },
          },
        })
        .then((data) => {
          if (data == null) {
            return false;
          }
          return slotModel
            .findOne({ where: { suid: data.suid, roundNo: "2", mgmt: false } })
            .then((slot) => {
              if (slot == null) {
                return false;
              }
              if (
                todayDate == slot.date &&
                todayTime >= slot.timeFrom &&
                todayTime <= slot.timeTo
              ) {
                return true;
              }
              return false;
            })
            .catch(() => {
              return false;
            });
        })
        .catch(() => {
          return false;
        });
      return finalData;
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
      adminMeetLink: "",
      user: {},
      project: {},
    };

    const round1Deadline = await resultsTimeCheck("1");
    const round2Deadline = await resultsTimeCheck("2");

    const userData = await userModel.findOne({
      attributes: ["name", "regNo", "projectLink", "puid"],
      where: { regNo },
    });

    const projectData = await projectModel.findOne({
      where: { puid: userData.puid },
    });

    resultData.project = projectData;
    resultData.user = userData;
    const roundModelData = await roundModel.findAll({
      include: [slotModel, adminModel],
      order: ["roundNo"],
      where: { regNo },
    });
    if (roundModelData.length === 0) {
      response(res, true, resultData, "Did not submit round0 form");
      return;
    }

    const checkRound2Slot = await checkRound2Time(req.user.regNo);

    roundModelData.map(async (roundData) => {
      switch (roundData.roundNo) {
        case "0":
          resultData.round0Status = true;

          resultData.round1Status = constants.Ready;
          domainAdder(roundData);
          slots.round1 = roundData.Slot == null ? false : roundData.Slot;
          break;

        case "1":
          resultData.round1Status = constants.PendingReview;
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
          } else if (round1Deadline) {
            resultData.round1Status = roundData.status;
          } else {
            resultData.round1Status = constants.PendingReview;
          }
          domainAdder(roundData);
          break;

        case "2":
          if (round1Deadline === false) {
            resultData.round1Status = constants.PendingReview;
            break;
          } else if (round1Deadline === true) {
            resultData.round1Status = constants.AcceptedReview;

            if (
              roundData.coreDomain === constants.Tech ||
              roundData.coreDomain === constants.Dsn
            ) {
              // placeholder value for round2NonMgmtStatus
              resultData.round2NonMgmtStatus = constants.PendingReview;

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
                if (checkRound2Slot) {
                  resultData.adminMeetLink = roundData.Admin.meetLink;
                }

                resultData.round2NonMgmtStatus = constants.Ready;
                slots.round2NonMgmt = roundData.Slot;
              } else {
                if (round2Deadline) {
                  resultData.round2NonMgmtStatus = roundData.status;
                } else {
                  resultData.round2NonMgmtStatus = constants.PendingReview;
                }
                slots.round2NonMgmt = roundData.Slot;
              }
            }

            if (roundData.coreDomain === constants.Mgmt) {
              resultData.round2MgmtStatus = constants.PendingReview;
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
                if (round2Deadline) {
                  resultData.round2MgmtStatus = roundData.status;
                } else {
                  resultData.round2MgmtStatus = constants.PendingReview;
                }
                slots.round2Mgmt = roundData.Slot;
              }
            }
            domainAdder(roundData);
            break;
          }
          break;

        case "3":
          if (round1Deadline === false) {
            resultData.round1Status = constants.PendingReview;
            break;
          } else if (round1Deadline === true) {
            resultData.round1Status = constants.AcceptedReview;
            if (round2Deadline === false) {
              if (roundData.coreDomain == constants.Mgmt) {
                resultData.round2MgmtStatus = constants.PendingReview;
              } else {
                resultData.round2NonMgmtStatus = constants.PendingReview;
              }
              break;
            } else if (round2Deadline === true) {
              if (roundData.coreDomain == constants.Mgmt) {
                resultData.round2MgmtStatus = constants.AcceptedReview;
              } else {
                resultData.round2NonMgmtStatus = constants.AcceptedReview;
              }
              resultData.round3Status = constants.PendingReview;
            }
          }
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

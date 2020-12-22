/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const logger = require("../../../configs/winston");
const roundModel = require("../../../models/roundModel");
const userModel = require("../../../models/userModel");
const slotModel = require("../../../models/slotModel");
const response = require("../../../utils/genericResponse");
const projectModel = require("../../../models/projectModel");
const constants = require("../../../utils/constants");
// const emailer = require("../../../utils/emailer");
// const templates = require("../../../utils/templates");
const db = require("../../../utils/db");

const fetchTechDsnRound2Candidates = async (req, res) => {
  roundModel
    .findAll({
      attributes: ["regNo"],
      include: [
        {
          model: userModel,
          where: { projectLink: { [Op.ne]: null } },
          include: projectModel,
        },
      ],

      where: {
        [Op.and]: [
          req.query,
          {
            auid: { [Op.is]: null },
            roundNo: "2",
            meetingCompleted: false,
            coreDomain: { [Op.or]: [constants.Tech, constants.Dsn] },
          },
        ],
      },
    })
    .then((result) => {
      if (result.length === 0) {
        response(
          res,
          true,
          null,
          "No Ready candidates for Tech/Design Round 2 found"
        );
      } else {
        response(
          res,
          true,
          result,
          "Ready candidates for Tech/Design Round 2 found"
        );
      }
    })
    .catch((err) => {
      logger.error(`Failure to fetchTechDsnRound2Candidates due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const getRound2Slots = async (req, res) => {
  const todayDate = moment()
    .add(constants.showSlotsafterHours, "hours")
    .format("YYYY-MM-DD");
  const todayTime = moment()
    .add(constants.showSlotsafterHours, "hours")
    .format("HH:mm:ss");

  await slotModel
    .findAll({
      where: {
        [Op.or]: [
          {
            roundNo: "2",
            mgmt: false,
            date: { [Op.gt]: todayDate },
          },
          {
            roundNo: "2",
            mgmt: false,
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
      logger.error(`Failure to getRound2Slots due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const fetchMyTechDesignMeetings = async (req, res) => {
  const { auid } = req.user;
  roundModel
    .findAll({
      attributes: ["id", "roundNo", "suid", "auid"],
      include: [
        slotModel,
        {
          model: userModel,
          include: projectModel,
        },
      ],

      where: {
        [Op.and]: [
          req.query,
          {
            auid,
            meetingCompleted: false,
            coreDomain: { [Op.or]: [constants.Tech, constants.Dsn] },
          },
        ],
      },
    })
    .then((results) => {
      if (results.length === 0) {
        response(res, true, "", "No meetings found!");
      } else {
        response(res, true, results, "Meetings found!");
      }
    })
    .catch((err) => response(res, false, "", err.toString()));
};

const selectR2TechDsnCandidate = async (req, res) => {
  const { regNo, suid } = req.body;
  const { auid } = req.user;

  try {
    await db.transaction(async (chain) => {
      const roundModelDetails = await roundModel.findOne({
        include: [userModel, slotModel],
        where: {
          auid: { [Op.is]: null },
          regNo,
          roundNo: "2",
          coreDomain: { [Op.or]: [constants.Tech, constants.Dsn] },
        },
      });
      if (roundModelDetails.length === 0) {
        throw Error("No such candidate found!");
      }
      const roundUpdate = await roundModel.update(
        {
          auid,
          suid,
        },
        {
          where: {
            auid: { [Op.is]: null },
            regNo,
            roundNo: "2",
            coreDomain: { [Op.or]: [constants.Tech, constants.Dsn] },
          },
          transaction: chain,
        }
      );
      if (roundUpdate == 0) {
        throw Error("Unable to update the candidate with the data");
      }
      const slotDetails = await slotModel.findOne({ where: { suid } });
      if (slotDetails.length === 0) {
        throw Error("Unable to find such slots ");
      }
      // const userDetails = roundModelDetails.User;
      // const candidateEmailId = [userDetails.email];
      // const template = templates.round2Interview(
      //   userDetails.name,
      //   slotDetails.date,
      //   slotDetails.timeFrom
      // );
      // const email = await emailer(template, candidateEmailId);
      // if (!email.success) {
      //   throw Error(
      //     `Unable to send the email to the candidate because: ${email.error}`
      //   );
      // }
      response(res, true, "", "Candidate Intrview Email Sent!");
    });
  } catch (err) {
    logger.error(`Failure to selectR2TechDsnCandidate due to ${err}`);
    response(res, false, "", err.toString());
  }
};

module.exports = {
  fetchTechDsnRound2Candidates,
  fetchMyTechDesignMeetings,
  selectR2TechDsnCandidate,
  getRound2Slots,
};

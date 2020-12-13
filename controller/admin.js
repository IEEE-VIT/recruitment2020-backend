/* eslint-disable eqeqeq */
const { Op, Sequelize } = require("sequelize");
const moment = require("moment-timezone");
const logger = require("../configs/winston");
const adminModel = require("../models/adminModel");
const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel");
const slotModel = require("../models/slotModel");
const deadlineModel = require("../models/deadlineModel");
const projectsModel = require("../models/projectModel");
const db = require("../utils/db");
const response = require("../utils/genericResponse");
const constants = require("../utils/constants");

const readAdmin = async (req, res) => {
  adminModel
    .findOne({ where: { auid: req.user.auid } })
    .then((admin) => {
      if (admin == null) {
        response(res, true, admin, "Admin ID invalid");
      } else {
        response(res, true, admin, "Admin found");
      }
    })
    .catch((err) => {
      logger.error(`Failure to readAdmin due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const updateAdmin = async (req, res) => {
  adminModel
    .update(
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        meetLink: req.body.meetLink,
      },
      { where: { auid: req.user.auid } }
    )
    .then((result) => {
      if (result == 0) {
        response(res, true, result, "Admin ID invalid");
      } else {
        response(res, true, result, "Admin updated successfully");
      }
    })
    .catch((err) => {
      logger.error(`Failure to updateAdmin due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const fetchTechDsnRound2Candidates = async (req, res) => {
  roundModel
    .findAll({
      attributes: ["regNo"],
      include: { model: userModel, where: { projectLink: { [Op.ne]: null } } },
      where: {
        [Op.and]: [
          req.query,
          {
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

const fetchMgmtRound2Candidates = async (req, res) => {
  roundModel
    .findAll({
      attributes: ["regNo"],
      include: userModel,
      where: {
        [Op.and]: [
          req.query,
          {
            roundNo: "2",
            meetingCompleted: false,
            coreDomain: constants.Mgmt,
          },
        ],
      },
    })
    .then((result) => {
      if (result.length === 0) {
        response(
          res,
          true,
          result,
          "No Ready candidates for Mgmt Round 2 found"
        );
      } else {
        response(res, true, result, "Ready candidates for Mgmt Round 2 found");
      }
    })
    .catch((err) => {
      logger.error(`Failure to fetchMgmtRound2Candidates due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const fetchAllAdmins = async (req, res) => {
  adminModel
    .findAll({
      where: req.query,
    })
    .then((admins) => {
      if (admins.length == 0) {
        response(res, true, admins, "No Admins Found");
      } else {
        response(res, true, admins, "Admins Found");
      }
    })
    .catch((err) => {
      logger.error(`Failure to fetchAllAdmins due to ${err}`);
      response(res, false, "", err.toString());
    });
};
const fetchExceptions = async (req, res) => {
  roundModel
    .findAll({
      include: [commentModel],
      where: {
        [Op.and]: [
          req.query,
          {
            exception: true,
          },
        ],
      },
    })
    .then((data) => {
      if (data.length == 0) {
        response(res, true, null, "No Exception Found");
      } else {
        response(res, true, data, "Exceptions Sent");
      }
    })
    .catch((err) => {
      logger.error(`Failure to fetchExceptions due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const resolveExceptions = async (req, res) => {
  try {
    const result = await db.transaction(async (t) => {
      const roundData = await roundModel.findOne(
        {
          where: {
            roundNo: req.body.roundNo,
            regNo: req.body.regNo,
            coreDomain: req.body.coreDomain,
            exception: true,
          },
        },
        { transaction: t }
      );

      if (roundData == null) {
        throw new Error("No such User with Exception found in given round");
      }

      const rawCommentData = await commentModel.findOne(
        {
          where: {
            cuid: roundData.cuid,
          },
        },
        { transaction: t }
      );

      if (rawCommentData == null) {
        throw new Error("No such comment found");
      }

      const adminData = await adminModel.findOne(
        {
          where: {
            auid: req.user.auid,
          },
        },
        { transaction: t }
      );

      if (adminData == null) {
        throw new Error("No such Admin found");
      }

      const updatedRoundData = await roundModel.update(
        {
          exception: false,
        },
        {
          where: {
            roundNo: req.body.roundNo,
            regNo: req.body.regNo,
            coreDomain: req.body.coreDomain,
            exception: true,
          },
        },
        { transaction: t }
      );

      const newComment = await rawCommentData.comment
        .concat(" // exception resolved: ")
        .concat(req.body.reason)
        .concat(" // by: ")
        .concat(adminData.name);

      const newCommentBool = await commentModel.update(
        {
          comment: newComment,
        },
        { where: { cuid: roundData.cuid } },
        { transaction: t }
      );
      if (newCommentBool == 0) {
        throw new Error("Error Resolving Exception");
      }
      return updatedRoundData;
    });
    response(res, true, result, "Exception resolved");
  } catch (err) {
    logger.error(`Failure to resolveExceptions due to ${err}`);
    response(res, false, "", err.toString());
  }
};

const fetchAllUsers = async (req, res) => {
  userModel
    .findAll({
      where: req.query,
    })
    .then((data) => {
      if (data !== null) {
        response(res, true, data, "All Users Data!");
      } else {
        response(
          res,
          true,
          data,
          "NO DATA FOUND! Contact Hemanth or Shubham ASAP!"
        );
      }
    })
    .catch((err) => {
      logger.error(`Failure to fetchAllUsers due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const setDeadline = async (req, res) => {
  await deadlineModel
    .findOne({ where: { roundNo: req.body.roundNo } })
    .then((data) => {
      if (data == null) {
        deadlineModel
          .create({
            roundNo: req.body.roundNo,
            // SEND DATE IN DD MMM YYYY FOR EG:(12 DEC 2020) TO PREVENT DD-MM & MM-DD CONFUSION
            date: moment(new Date(req.body.date)),
            time: req.body.time,
          })
          .then((newDeadline) => {
            response(res, true, newDeadline, "Deadline Set");
          })
          .catch((err) => {
            logger.error(`Failure to setDeadline due to ${err}`);
            response(res, false, "", err.toString());
          });
      } else {
        deadlineModel
          .update(
            {
              date: req.body.date,
              time: req.body.time,
            },
            { where: { roundNo: req.body.roundNo } }
          )
          .then((updatedDeadline) => {
            response(res, true, updatedDeadline, "Deadline Set");
          })
          .catch((err) => {
            logger.error(`Failure to setDeadline due to ${err}`);
            response(res, false, "", err.toString());
          });
      }
    })
    .catch((err) => {
      logger.error(`Failure to setDeadline due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const addSlot = async (req, res) => {
  await slotModel
    .create({
      roundNo: req.body.roundNo,
      // SEND DATE IN DD MMM YYYY FOR EG:(12 DEC 2020) TO PREVENT DD-MM & MM-DD CONFUSION
      date: moment(new Date(req.body.date)),
      mgmt: req.body.mgmt,
      timeFrom: req.body.timeFrom,
      timeTo: req.body.timeTo,
    })
    .then((slot) => {
      response(res, true, slot, "Slot Added");
    })
    .catch((err) => {
      logger.error(`Failure to addSlot due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const getAllMeetings = async (req, res) => {
  const queryParams = req.query;
  queryParams.auid = req.user.auid;
  roundModel
    .findAll({
      where: queryParams,
    })
    .then((data) => {
      if (data.length === 0) {
        response(res, true, "", "No Meetings found for this admin!");
      } else {
        response(res, true, data, "Meetings Found!");
      }
    })
    .catch((err) => {
      logger.error(`Failure to getAllMeetings due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const fetchOnGoingMeetings = async (req, res) => {
  roundModel
    .findAll({
      include: [userModel, adminModel, slotModel],
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("User.regNo")), "User.regNo"],
      ].concat(Object.keys(roundModel.rawAttributes)),
      where: {
        [Op.and]: [
          {
            meetingCompleted: false,
            auid: { [Op.ne]: null },
          },
          req.query,
        ],
      },
    })
    .then((data) => {
      if (data.length === 0) {
        response(res, true, false, "Unable to find any ongoing meetings");
      } else {
        response(res, true, data, "Meetings Found!");
      }
    })
    .catch((err) => {
      response(res, false, false, err.toString());
    });
};

const fetchProjects = async (req, res) => {
  projectsModel
    .findAll({
      where: req.query,
    })
    .then((result) => {
      if (result.length === 0) {
        response(res, true, "", "No Projects found!");
      } else {
        response(res, true, result, "Projects found!");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const getAllSlots = async (req, res) => {
  await slotModel
    .findAll({
      where: req.query,
      order: [
        ["date", "ASC"],
        ["timeFrom", "ASC"],
      ],
    })
    .then((slots) => {
      if (slots == "") {
        response(res, true, slots, "No such Slots available");
      } else {
        response(res, true, slots, "All Slots accordlingly sent");
      }
    })
    .catch((err) => {
      logger.error(`Failure to getAllSlots due to ${err}`);
      response(res, false, "", err.toString());
    });
};
const fetchGdpCandidates = async (req, res) => {
  roundModel
    .findAll({
      attributes: ["id", "roundNo", "suid", "auid"],
      include: userModel,
      where: {
        [Op.and]: [
          req.query,
          {
            meetingCompleted: false,
            coreDomain: constants.Mgmt,
            roundNo: "2",
          },
        ],
      },
    })
    .then((result) => {
      if (result.length === 0) {
        response(res, true, "", "No candidates found!");
      } else {
        response(res, true, result, "Candidates found!");
      }
    })
    .catch((err) => response(res, false, "", err.toString()));
};

const fetchGdaCandidates = async (req, res) => {
  const { suid } = req.query;
  roundModel
    .findAll({
      attributes: ["id", "roundNo", "suid", "auid"],
      include: userModel,
      where: {
        [Op.and]: [
          req.query,
          {
            meetingCompleted: false,
            coreDomain: constants.Mgmt,
            roundNo: "2",
            suid,
          },
        ],
      },
    })
    .then((results) => {
      if (results.length === 0) {
        response(res, true, "", "No Meetings found!");
      } else {
        response(res, true, results, "Meetings found!");
      }
    })
    .catch((err) => response(res, false, "", err.toString()));
};

const fetchMyTechDesignMeetings = async (req, res) => {
  const { auid } = req.user;
  roundModel
    .findAll({
      attributes: ["id", "roundNo", "suid", "auid"],
      include: userModel,
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

const fetchOnGoingGda = async (req, res) => {
  roundModel
    .findAll({
      include: [adminModel, slotModel],
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("Round.auid")), "Round.auid"],
      ].concat(Object.keys(roundModel.rawAttributes)),
      where: {
        [Op.and]: [
          {
            meetingCompleted: false,
            roundNo: "2",
            auid: { [Op.ne]: null },
            coreDomain: constants.Mgmt,
          },
          req.query,
        ],
      },
    })
    .then((data) => {
      if (data.length === 0) {
        response(res, true, false, "Unable to find any ongoing meetings");
      } else {
        response(res, true, data, "Meetings Found!");
      }
    })
    .catch((err) => {
      response(res, false, false, err.toString());
    });
};

module.exports = {
  fetchAllUsers,
  readAdmin,
  updateAdmin,
  fetchTechDsnRound2Candidates,
  fetchMgmtRound2Candidates,
  fetchGdpCandidates,
  fetchGdaCandidates,
  fetchMyTechDesignMeetings,
  fetchAllAdmins,
  fetchExceptions,
  resolveExceptions,
  setDeadline,
  addSlot,
  getAllMeetings,
  fetchOnGoingMeetings,
  fetchProjects,
  getAllSlots,
  fetchOnGoingGda,
};

/* eslint-disable eqeqeq */
const { Op, Sequelize } = require("sequelize");
const moment = require("moment-timezone");
const logger = require("../../configs/winston");
const adminModel = require("../../models/adminModel");
const roundModel = require("../../models/roundModel");
const userModel = require("../../models/userModel");
const slotModel = require("../../models/slotModel");
const projectModel = require("../../models/projectModel");
const slotLimitModel = require("../../models/slotLimitModel");
const deadlineModel = require("../../models/deadlineModel");
const projectsModel = require("../../models/projectModel");
const response = require("../../utils/genericResponse");

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
      include: [
        adminModel,
        slotModel,
        {
          model: userModel,
          include: projectModel,
        },
      ],

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

const getslotLimits = async (req, res) => {
  await slotLimitModel
    .findAll()
    .then((slots) => {
      response(res, true, slots, "All Slots accordlingly sent");
    })
    .catch((err) => {
      logger.error(`Failure to getAllSlots due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const updateSlotLimit = async (req, res) => {
  await slotLimitModel
    .findOne({ where: { roundNo: req.body.roundNo } })
    .then(async (slot) => {
      if (slot === null) {
        await slotLimitModel
          .create({
            roundNo: req.body.roundNo,
            maxCandidates: req.body.maxCandidates,
          })
          .then((createdSlot) => {
            response(res, true, createdSlot, "New Slot Created");
          })
          .catch((err) => {
            logger.error(`Failure to addSlotLimit due to ${err}`);
            response(res, false, "", err.toString());
          });
      } else {
        if (req.body.maxCandidates < 0) {
          throw new Error("Please enter a valid number");
        }
        await slotLimitModel
          .update(
            {
              maxCandidates: req.body.maxCandidates,
            },
            { where: { roundNo: req.body.roundNo } }
          )
          .then((updateddSlot) => {
            response(res, true, updateddSlot, "Slot Updated");
          })
          .catch((err) => {
            logger.error(`Failure to updateSlotLimit due to ${err}`);
            response(res, false, "", err.toString());
          });
      }
    })
    .catch((err) => {
      logger.error(`Failure to updateSlotLimit due to ${err}`);
      response(res, false, "", err.toString());
    });
};

module.exports = {
  fetchAllUsers,
  readAdmin,
  updateAdmin,
  fetchAllAdmins,
  setDeadline,
  addSlot,
  getAllMeetings,
  fetchOnGoingMeetings,
  fetchProjects,
  getAllSlots,
  getslotLimits,
  updateSlotLimit,
};

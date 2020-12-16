const slotModel = require("../../models/slotModel");
const roundModel = require("../../models/roundModel");
const userModel = require("../../models/userModel");
const commentsModel = require("../../models/commentModel");
const response = require("../../utils/genericResponse");
const constants = require("../../utils/constants");
const logger = require("../../configs/winston");

const fetchMeetings = async (req, res) => {
  roundModel
    .findAll({
      include: userModel,
      order: [["roundNo", "DESC"]],
      where: {
        regNo: req.query.regNo,
        meetingCompleted: false,
        status: constants.PendingReview,
      },
    })
    .then((data) => {
      if (data !== null) {
        response(
          res,
          true,
          data,
          "Available Meetings found for the candidate!"
        );
      } else {
        response(
          res,
          true,
          data,
          "No Pending Meetings found for the candidate!"
        );
      }
    })
    .catch((err) => {
      logger.error(`Failure to fetchMeetings due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const meetingCandidateHistory = async (req, res) => {
  roundModel
    .findAll({
      order: ["roundNo"],
      include: [userModel, slotModel, commentsModel],
      where: {
        regNo: req.query.regNo,
      },
    })
    .then((data) => {
      if (data.length === 0) {
        response(res, true, data, "No history found for the candidate!");
      } else {
        response(res, true, data, "History found for the candidate!");
      }
    })
    .catch((err) => {
      logger.error(`Failure to meetingCandidateHistory due to ${err}`);
      response(res, false, "", err.toString());
    });
};

module.exports = { fetchMeetings, meetingCandidateHistory };

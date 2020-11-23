const slotModel = require("../models/slotModel");
const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const commentsModel = require("../models/commentModel");
const response = require("../utils/genericResponse");

const fetchMeetings = async (req, res) => {
  roundModel
    .findAll({
      include: userModel,
      where: {
        regNo: req.body.regNo,
        meetingCompleted: false,
        status: "PR",
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
      response(res, false, "", err.toString());
    });
};

const meetingCandidateHistory = async (req, res) => {
  roundModel
    .findAll({
      include: [userModel, slotModel, commentsModel],
      where: {
        regNo: req.body.regNo,
      },
    })
    .then((data) => {
      if (data !== null) {
        response(res, true, data, "History found for the candidate!");
      } else {
        response(res, true, data, "No history found for the candidate!");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

module.exports = { meetingCandidateHistory, fetchMeetings };

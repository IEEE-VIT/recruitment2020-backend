const slotModel = require("../models/slotModel");
const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const commentsModel = require("../models/commentModel");
const response = require("../utils/genericResponse");
const db = require("../utils/db");

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

const round1Amc = async (req, res) => {
  const { id, comment, status, eligibleDomains, auid, regNo } = req.body;
  try {
    await db.transaction(async (chain) => {
      const commentObj = await commentsModel.create(
        {
          auid,
          regNo,
          comment,
        },
        { transaction: chain }
      );
      if (commentObj == null) {
        throw Error("Error in creating comment");
      }
      const currentRoundUpdate = await roundModel.update(
        {
          meetingCompleted: true,
          status,
        },
        { where: { id }, transaction: chain }
      );

      if (currentRoundUpdate == null) {
        throw Error("Unable to update Round 1 Object.");
      }

      for (let i = 0; i < eligibleDomains.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const round2create = await roundModel.create(
          {
            regNo,
            roundNo: 2,
            domain: eligibleDomains[i],
            domainType: eligibleDomains[i],
          },
          { transaction: chain }
        );
        if (round2create == null) {
          throw Error(
            `Unable to create object for round2 in domain of ${eligibleDomains[i]}`
          );
        }
      }

      response(res, true, "", "Succesfully Reviewed Candidate for Round 1");
    });
  } catch (err) {
    response(res, false, "", err.toString());
  }
};

const postAmc = async (req, res) => {
  const { id } = req.body;
  roundModel
    .findOne({ include: userModel, where: { id } })
    .then((data) => {
      if (data != null) {
        if (data.meetingCompleted) {
          response(
            res,
            true,
            "",
            "Candidate's Round 1 Interview Has already been taken!"
          );
          return;
        }
        switch (data.roundNo) {
          case "1":
            round1Amc(req, res);
            break;
          default:
            response(
              res,
              true,
              "",
              "Something happened that's not supposed to happen, contact Hemanth or Shhubham ASAP!"
            );
        }
      } else {
        response(res, true, "", "Invalid id parsed");
      }
    })
    .catch((err) => response(res, false, "", err.toString()));
};

module.exports = { meetingCandidateHistory, fetchMeetings, postAmc };

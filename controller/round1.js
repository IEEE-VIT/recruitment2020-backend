/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const userModel = require("../models/userModel");
const roundModel = require("../models/roundModel");
const adminModel = require("../models/adminModel");
const response = require("../utils/genericResponse");
const db = require("../utils/db");
const logger = require("../configs/winston");
const emailer = require("../utils/emailer");
const templates = require("../utils/templates");

const updateProjectLink = async (req, res) => {
  userModel
    .update(
      { projectLink: req.body.projectLink },
      { where: { regNo: req.user.regNo } }
    )
    .then((result) => {
      if (result == 0) {
        response(res, true, result, "User not found");
      } else {
        response(res, true, result, "User Project updated");
      }
    })
    .catch((err) => {
      logger.error(`Failure to updateProjectLink due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const fetchReadyCandidates = async (req, res) => {
  roundModel
    .findAll({
      attributes: ["regNo"],
      include: userModel,
      where: {
        roundNo: "1",
        meetingCompleted: false,
        auid: { [Op.eq]: null },
      },
    })
    .then((result) => {
      if (result.length === 0) {
        response(res, true, result, "No Ready candidates for Round 1 found");
      } else {
        response(res, true, result, "Ready candidates for Round 1 found");
      }
    })
    .catch((err) => {
      logger.error(`Failure to fetchReadyCandidates due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const selectReadyCandidates = async (req, res) => {
  const chainTransaction = await db.transaction();
  try {
    const { candidates } = req.body;
    const adminId = req.user.auid;

    for (let i = 0; i < candidates.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const result = await roundModel.update(
        {
          auid: adminId,
        },
        {
          where: {
            regNo: candidates[i],
          },
          transaction: chainTransaction,
        }
      );
      if (result == 0) {
        throw Error(
          "Unable to update with admin, please resend the candidates list"
        );
      }
      // eslint-disable-next-line no-await-in-loop
      const roundModelDetails = await roundModel.findOne({
        where: { regNo: candidates[i], roundNo: "1" },
      });
      if (roundModelDetails.length == 0) {
        throw Error("No such user found in round 1");
      }

      // eslint-disable-next-line no-await-in-loop
      const admin = await adminModel.findOne({ where: { auid: adminId } });
      if (admin.length == 0) {
        throw Error("No admin found with such auid");
      }

      // eslint-disable-next-line no-await-in-loop
      const user = await userModel.findOne({ where: { regNo: candidates[i] } });
      if (user.length == 0) {
        throw Error("Unable to find such user");
      }

      const candidateEmailId = [user.email];
      const template = templates.round1Interview(user.name, admin.meetLink);
      // eslint-disable-next-line no-await-in-loop
      const email = await emailer(template, candidateEmailId);
      if (!email.success) {
        throw Error(
          `Unable to send the email to the candidate because: ${email.error}`
        );
      }
    }
    await chainTransaction.commit();
    response(
      res,
      true,
      "All Candidates have been assigned and Emails have been sent"
    );
  } catch (err) {
    logger.error(`Failure to selectReadyCandidates due to ${err}`);
    await chainTransaction.rollback();
    response(res, false, "", err.toString());
  }
};

const isReady = async (req, res) => {
  roundModel
    .findOne({ where: { regNo: req.user.regNo, roundNo: "0" } })
    .then((data) => {
      if (data == null) {
        throw new Error("Registration Number does not exist in round 0");
        // response(res, true, data, "Invalid Registration Number");
      }
      roundModel
        .update(
          {
            roundNo: "1",
          },
          { where: { regNo: req.user.regNo, roundNo: "0" } }
        )
        .then((round) => {
          response(res, true, round, "Added to Round 1");
        });
    })
    .catch((err) => {
      logger.error(`Failure to isReady due to ${err}`);
      response(res, false, "", err.toString());
    });
};

module.exports = {
  updateProjectLink,
  fetchReadyCandidates,
  isReady,
  selectReadyCandidates,
};

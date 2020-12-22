/* eslint-disable eqeqeq */
const moment = require("moment-timezone");
const { Op } = require("sequelize");
const userModel = require("../../models/userModel");
const roundModel = require("../../models/roundModel");
const response = require("../../utils/genericResponse");
const logger = require("../../configs/winston");
const constants = require("../../utils/constants");

moment.tz.setDefault("Asia/Calcutta");

const updateProjectLink = async (req, res) => {
  const todayTime = moment();
  const roundData = await roundModel.findOne({
    where: {
      roundNo: "2",
      regNo: req.user.regNo,
      coreDomain: { [Op.or]: [constants.Tech, constants.Dsn] },
    },
  });
  if (roundData === null) {
    response(res, false, "", "No Such Entry found!");
    return;
  }
  if (moment(todayTime).isAfter(roundData.projectDeadline)) {
    response(res, true, { passed: true }, "Project Deadline passed");
    return;
  }
  userModel
    .update(
      { projectLink: req.body.projectLink },
      { where: { regNo: req.user.regNo } }
    )
    .then((result) => {
      const newResult = result;
      newResult.passed = false;
      if (result == 0) {
        response(res, true, newResult, "User not found");
      } else {
        response(res, true, newResult, "User Project updated");
      }
    })
    .catch((err) => {
      logger.error(`Failure to updateProjectLink due to ${err}`);
      response(res, false, "", err.toString());
    });
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
  isReady,
};

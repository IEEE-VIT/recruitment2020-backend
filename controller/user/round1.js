/* eslint-disable eqeqeq */
const userModel = require("../../models/userModel");
const roundModel = require("../../models/roundModel");
const response = require("../../utils/genericResponse");
const logger = require("../../configs/winston");

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

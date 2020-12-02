/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel");
const deadlineModel = require("../models/deadlineModel");
const response = require("../utils/genericResponse");

moment.tz.setDefault("Asia/Calcutta");

const candidates = async (req, res) => {
  await roundModel
    .findAll({
      include: [userModel, commentModel],
      where: {
        [Op.and]: [
          req.query,
          {
            roundNo: "3",
          },
        ],
      },
    })
    .then((users) => {
      if (users == null) {
        response(res, true, "", "No Users in round 3 till now");
      } else {
        response(res, true, users, "Users in round 3 are sent");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const getResults = async (req, res) => {
  const todayDate = moment().format("YYYY-MM-DD");
  const todayTime = moment().format("HH:mm:ss");

  await deadlineModel
    .findOne({ where: { roundNo: req.query.roundNo } })
    .then((roundDeadline) => {
      if (
        todayDate >= roundDeadline.date ||
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
            response(res, false, "", err.toString());
          });
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};
module.exports = {
  candidates,
  getResults,
};

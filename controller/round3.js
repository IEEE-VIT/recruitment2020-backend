/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel");
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

module.exports = {
  candidates,
};

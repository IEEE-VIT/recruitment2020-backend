/* eslint-disable eqeqeq */
const userModel = require("../models/userModel");
const roundModel = require("../models/roundModel");
const response = require("../utils/genericResponse");

const createUser = async (req, res) => {
  userModel
    .create({
      regNo: req.body.regNo,
      name: req.body.name,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
      password: req.body.password,
    })
    .then((user) => {
      response(res, true, user, "User created successfully");
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const readUser = async (req, res) => {
  userModel
    .findOne({
      where: { regNo: req.query.regNo },
      attributes: { exclude: ["password"] },
    })
    .then((user) => {
      if (user === null) {
        response(res, true, user, "User doesn't exists");
      } else {
        response(res, true, user, "User exists");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const updateUser = async (req, res) => {
  userModel
    .update(
      {
        regNo: req.body.regNo,
        name: req.body.name,
        phoneNo: req.body.phoneNo,
        email: req.body.email,
        password: req.body.password,
        coreDomain: req.body.coreDomain,
        specificDomains: req.body.specificDomains,
      },
      { where: { regNo: req.body.regNo } }
    )
    .then((result) => {
      if (result == 0) {
        response(res, true, result, "User not found");
      } else {
        response(res, true, result, "User updated successfully");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const deleteUser = async (req, res) => {
  userModel
    .destroy({ where: { regNo: req.body.regNo } })
    .then((user) => {
      if (user == 0) {
        response(res, true, user, "User not found");
      } else {
        response(res, true, user, "User deleted successfully");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const userStatus = async (req, res) => {
  roundModel
    .findAll({
      order: ["roundNo"],
      where: {
        regNo: req.user.regNo,
      },
    })
    .then((data) => {
      const latestRound = data[0].roundNo;
      const resultformed = {};
      const round2Data = [];
      resultformed.latestRound = latestRound;
      switch (latestRound) {
        case "2":
          data.forEach((roundData) => {
            if (roundData.roundNo === "2") {
              round2Data.push(roundData);
            }
          });
          resultformed.roundsData = round2Data;
          break;
        case "1":
        case "0":
          resultformed.roundData = data;
          break;
        case "3":
          resultformed.roundData = [];
          break;
        default:
          resultformed.latestRound = "Unkown Round";
      }
      if (data.length === 0) {
        response(res, true, data, "User does not exists");
      } else {
        response(res, true, resultformed, "History found for the candidate!");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

module.exports = {
  createUser,
  updateUser,
  readUser,
  deleteUser,
  userStatus,
};

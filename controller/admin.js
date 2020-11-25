/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const adminModel = require("../models/adminModel");
const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const commentModel = require("../models/commentModel");
const db = require("../utils/db");
const response = require("../utils/genericResponse");

const readAdmin = async (req, res) => {
  adminModel
    .findOne({ where: { auid: req.query.auid } })
    .then((admin) => {
      if (admin == null) {
        response(res, true, admin, "Admin ID invalid");
      } else {
        response(res, true, admin, "Admin found");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const updateAdmin = async (req, res) => {
  adminModel
    .update(
      {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        meetLink: req.body.meetLink,
      },
      { where: { auid: req.body.auid } }
    )
    .then((result) => {
      if (result == 0) {
        response(res, true, result, "Admin ID invalid");
      } else {
        response(res, true, result, "Admin updated successfully");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const fetchTechRound2Candidates = async (req, res) => {
  roundModel
    .findAll({
      attributes: ["regNo"],
      include: userModel,
      where: {
        [Op.and]: [
          req.query,
          {
            roundNo: "2",
            meetingCompleted: false,
            domainType: "TECH",
          },
        ],
      },
    })
    .then((result) => {
      if (result.length === 0) {
        response(res, true, null, "No Ready candidates for Tech Round 2 found");
      } else {
        response(res, true, result, "Ready candidates for Tech Round 2 found");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const fetchMgmtRound2Candidates = async (req, res) => {
  roundModel
    .findAll({
      attributes: ["regNo"],
      include: userModel,
      where: {
        [Op.and]: [
          req.query,
          {
            roundNo: "2",
            meetingCompleted: false,
            domainType: "MGMT",
          },
        ],
      },
    })
    .then((result) => {
      if (result.length === 0) {
        response(
          res,
          true,
          result,
          "No Ready candidates for Mgmt Round 2 found"
        );
      } else {
        response(res, true, result, "Ready candidates for Mgmt Round 2 found");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const fetchAllAdmins = async (req, res) => {
  adminModel
    .findAll({
      where: req.query,
    })
    .then((admins) => {
      response(res, true, admins, "Admins Found");
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};
const fetchExceptions = async (req, res) => {
  roundModel
    .findAll({
      include: [commentModel],
      where: {
        [Op.and]: [
          req.query,
          {
            exception: true,
          },
        ],
      },
    })
    .then((data) => {
      if (data.length == 0) {
        response(res, true, null, "No Exception Found");
      } else {
        response(res, true, data, "Exceptions Sent");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const resolveExceptions = async (req, res) => {
  try {
    const result = await db.transaction(async (t) => {
      const roundData = await roundModel.findOne(
        {
          where: {
            roundNo: req.body.roundNo,
            regNo: req.body.regNo,
            coreDomain: req.body.coreDomain,
          },
        },
        { transaction: t }
      );

      if (roundData == null) {
        throw new Error("No such User found in given round");
      }

      if (roundData.exception == false) {
        throw new Error("No such Exception found");
      }

      const rawCommentData = await commentModel.findOne(
        {
          where: {
            cuid: roundData.cuid,
          },
        },
        { transaction: t }
      );

      if (rawCommentData == null) {
        throw new Error("No such comment found");
      }

      const adminData = await adminModel.findOne(
        {
          where: {
            auid: req.body.auid,
          },
        },
        { transaction: t }
      );

      if (adminData == null) {
        throw new Error("No such Admin found");
      }

      const updatedRoundData = await roundModel.update(
        {
          exception: false,
        },
        {
          where: {
            roundNo: req.body.roundNo,
            regNo: req.body.regNo,
            coreDomain: req.body.coreDomain,
          },
        },
        { transaction: t }
      );

      const newComment = await rawCommentData.comment
        .concat(" // exception resolved: ")
        .concat(req.body.reason)
        .concat(" // by: ")
        .concat(adminData.name);

      const newCommentBool = await commentModel.update(
        {
          comment: newComment,
        },
        { where: { cuid: roundData.cuid } },
        { transaction: t }
      );
      if (newCommentBool == 0) {
        throw new Error("Error Resolving Exception");
      }
      return updatedRoundData;
    });
    response(res, true, result, "Exception resolved");
  } catch (err) {
    response(res, false, "", err.toString());
  }
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
      response(res, false, "", err.toString());
    });
};

module.exports = {
  fetchAllUsers,
  readAdmin,
  updateAdmin,
  fetchTechRound2Candidates,
  fetchMgmtRound2Candidates,
  fetchAllAdmins,
  fetchExceptions,
  resolveExceptions,
};

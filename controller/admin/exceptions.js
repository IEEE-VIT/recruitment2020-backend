/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const logger = require("../../configs/winston");
const adminModel = require("../../models/adminModel");
const roundModel = require("../../models/roundModel");
const commentModel = require("../../models/commentModel");
const db = require("../../utils/db");
const response = require("../../utils/genericResponse");

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
      logger.error(`Failure to fetchExceptions due to ${err}`);
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
            exception: true,
          },
        },
        { transaction: t }
      );

      if (roundData == null) {
        throw new Error("No such User with Exception found in given round");
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
            auid: req.user.auid,
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
            exception: true,
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
    logger.error(`Failure to resolveExceptions due to ${err}`);
    response(res, false, "", err.toString());
  }
};
module.exports = {
  fetchExceptions,
  resolveExceptions,
};

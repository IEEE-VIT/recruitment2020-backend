/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const logger = require("../../configs/winston");
const adminModel = require("../../models/adminModel");
const roundModel = require("../../models/roundModel");
const userModel = require("../../models/userModel");
const commentModel = require("../../models/commentModel");
const db = require("../../utils/db");
const response = require("../../utils/genericResponse");
const constants = require("../../utils/constants");

const fetchExceptions = async (req, res) => {
  roundModel
    .findAll({
      include: [commentModel, userModel],
      where: {
        [Op.and]: [
          req.query,
          {
            status: constants.ExceptionReview,
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
            status: constants.ExceptionReview,
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
          status: req.body.status,
        },
        {
          where: {
            roundNo: req.body.roundNo,
            regNo: req.body.regNo,
            coreDomain: req.body.coreDomain,
            status: constants.ExceptionReview,
          },
        },
        { transaction: t }
      );

      if (updatedRoundData === 0) {
        throw new Error("Error updating roundData");
      }

      if (req.body.status === constants.AcceptedReview) {
        let newRoundNo = 1;
        // eslint-disable-next-line default-case
        switch (req.body.roundNo) {
          case "1":
            newRoundNo = "2";
            break;

          case "2":
            newRoundNo = "3";
            break;
        }
        // eslint-disable-next-line no-unused-vars
        const nextRoundRow = await roundModel.create(
          {
            regNo: req.body.regNo,
            roundNo: newRoundNo,
            status: constants.PendingReview,
            specificDomain: roundData.coreDomain,
            coreDomain: roundData.specificDomain,
          },
          { transaction: t }
        );
      }

      const updatedComment = await rawCommentData.comment
        .concat(" // exception resolved: ")
        .concat(req.body.reason)
        .concat(" // by: ")
        .concat(adminData.name);

      const newCommentBool = await commentModel.update(
        {
          comment: updatedComment,
        },
        { where: { cuid: roundData.cuid } },
        { transaction: t }
      );
      if (newCommentBool == 0) {
        throw new Error("Error Resolving Exception");
      }

      if (updatedRoundData == 1) {
        return true;
      }
      return false;
    });
    response(res, true, result, "Exception resolved");
  } catch (err) {
    logger.error(`Failure to resolveExceptions due to ${err}`);
    response(res, false, false, err.toString());
  }
};
module.exports = {
  fetchExceptions,
  resolveExceptions,
};

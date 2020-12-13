/* eslint-disable eqeqeq */
const slotModel = require("../models/slotModel");
const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const commentsModel = require("../models/commentModel");
const projectsModel = require("../models/projectModel");
const response = require("../utils/genericResponse");
const db = require("../utils/db");
const constants = require("../utils/constants");
const logger = require("../configs/winston");

const fetchProjects = async (req, res) => {
  projectsModel
    .findAll({
      where: req.query,
    })
    .then((data) => {
      if (data.length === 0) {
        response(res, true, "", "No Projects Found!");
      } else {
        response(res, true, data, "Projects Found!");
      }
    })
    .catch((err) => {
      logger.error(`Failure to fetchProjects due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const fetchMeetings = async (req, res) => {
  roundModel
    .findAll({
      include: userModel,
      order: [["roundNo", "DESC"]],
      where: {
        regNo: req.query.regNo,
        meetingCompleted: false,
        status: constants.PendingReview,
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
      logger.error(`Failure to fetchMeetings due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const meetingCandidateHistory = async (req, res) => {
  roundModel
    .findAll({
      order: ["roundNo"],
      include: [userModel, slotModel, commentsModel],
      where: {
        regNo: req.query.regNo,
      },
    })
    .then((data) => {
      if (data.length === 0) {
        response(res, true, data, "No history found for the candidate!");
      } else {
        response(res, true, data, "History found for the candidate!");
      }
    })
    .catch((err) => {
      logger.error(`Failure to meetingCandidateHistory due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const round1Amc = async (req, res) => {
  const { comment, status, eligibleDomains, regNo, puid } = req.body;
  try {
    const roundModelData = await roundModel.findOne({
      where: {
        regNo,
        roundNo: "1",
      },
    });
    if (roundModelData === null) {
      throw Error("Such entry does not exists!");
    }
    if (
      roundModelData.meetingCompleted &&
      roundModelData.status != constants.PendingReview
    ) {
      throw Error("Candidate's Round 1 interview has already been taken!");
    }
    await db.transaction(async (chain) => {
      const commentObj = await commentsModel.create(
        {
          auid: req.user.auid,
          regNo,
          comment,
        },
        { transaction: chain }
      );
      if (commentObj === null) {
        throw Error("Error in creating comment");
      }
      const currentRoundUpdate = await roundModel.update(
        {
          meetingCompleted: true,
          status,
          cuid: commentObj.cuid,
          auid: req.user.auid,
        },
        { where: { regNo, roundNo: "1" }, transaction: chain }
      );

      if (currentRoundUpdate == 0) {
        throw Error("Unable to update Round 1 Object.");
      }

      if (status === constants.AcceptedReview) {
        for (let i = 0; i < eligibleDomains.length; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          const userProjectIdUpdate = await userModel.update(
            { puid },
            { where: { regNo }, transaction: chain }
          );
          if (userProjectIdUpdate == 0) {
            throw Error("Unable to Assign Project to user");
          }
          // eslint-disable-next-line no-await-in-loop
          const round2create = await roundModel.create(
            {
              regNo,
              roundNo: 2,
              status: constants.PendingReview,
              specificDomain: eligibleDomains[i],
              coreDomain: eligibleDomains[i],
            },
            { transaction: chain }
          );
          if (round2create == null) {
            throw Error(
              `Unable to create object for round2 in domain of ${eligibleDomains[i]}`
            );
          }
        }
      }

      response(res, true, "", "Succesfully Reviewed Candidate for Round 1");
    });
  } catch (err) {
    logger.error(`Failure to round1Amc due to ${err}`);
    response(res, false, "", err.toString());
  }
};

const round2Amc = async (req, res) => {
  const { comment, status, specificDomain, coreDomain, regNo } = req.body;

  try {
    const roundModelData = await roundModel.findAll({
      where: {
        regNo,
        roundNo: "2",
        coreDomain,
      },
    });
    if (roundModelData.length === 0) {
      throw Error("Such entries do no exists!");
    }
    for (let i = 0; i < roundModelData.length; i += 1) {
      if (
        roundModelData[i].meetingCompleted &&
        roundModelData[i].status != constants.PendingReview
      ) {
        throw Error(
          "Candidate's Round 2 Interview for this coreDomain has already been taken!"
        );
      }
    }
    await db.transaction(async (chain) => {
      const commentObj = await commentsModel.create(
        {
          auid: req.user.auid,
          regNo,
          comment,
        },
        { transaction: chain }
      );
      if (commentObj == null) {
        throw Error("Error in creating comment");
      }

      const specificDomainUpdate = await roundModel.update(
        {
          status: constants.RejectedReview,
          meetingCompleted: true,
          cuid: commentObj.cuid,
          auid: req.user.auid,
        },
        { transaction: chain, where: { coreDomain, regNo } }
      );
      if (specificDomainUpdate == 0) {
        throw Error(
          "Unable to update other entries in Round2 for the candidate in the same core domain"
        );
      }

      if (status === constants.AcceptedReview) {
        const approvalDomainUpdate = await roundModel.update(
          {
            status,
            meetingCompleted: true,
            cuid: commentObj.cuid,
            auid: req.user.auid,
          },
          { where: { coreDomain, specificDomain }, transaction: chain }
        );
        if (approvalDomainUpdate == 0) {
          throw Error("Unable to approve candidate in the domain");
        }
        const round3Obj = await roundModel.create(
          {
            roundNo: "3",
            regNo,
            specificDomain,
            coreDomain: specificDomain,
            status: constants.PendingReview,
          },
          { transaction: chain }
        );

        if (round3Obj == null) {
          throw Error("Unable to create Round3 Object for the candidate");
        }
      }
      response(res, true, "", "Succesfully Reviewed Candidate for Round 2");
    });
  } catch (err) {
    logger.error(`Failure to round2Amc due to ${err}`);
    response(res, false, "", err.toString());
  }
};

const round3Amc = async (req, res) => {
  const { comment, status, regNo } = req.body;
  try {
    await db.transaction(async (chain) => {
      const roundModelData = await roundModel.findAll({
        where: { regNo, roundNo: "3" },
      });
      if (roundModelData.length == 0) {
        throw Error("No Such candidate for round3 found!");
      }

      const commentObj = await commentsModel.create(
        {
          auid: req.user.auid,
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
          cuid: commentObj.cuid,
          auid: req.user.auid,
        },
        { where: { regNo, roundNo: "3" }, transaction: chain }
      );

      if (currentRoundUpdate == 0) {
        throw Error("Unable to update Round 1 Object.");
      }
      response(res, true, "", "Round 3 Review for Candidate Succesful!");
    });
  } catch (err) {
    logger.error(`Failure to round3Amc due to ${err}`);
    response(res, false, "", err.toString());
  }
};

const postException = async (req, res) => {
  const { comment, regNo, coreDomain, roundNo } = req.body;
  try {
    await db.transaction(async (chain) => {
      const commentObj = await commentsModel.create(
        {
          auid: req.user.auid,
          regNo,
          comment,
        },
        { transaction: chain }
      );
      if (commentObj == null) {
        throw Error("Error in creating comment");
      }

      const roundModelUpdate = roundModel.update(
        {
          status: constants.ExceptionReview,
          meetingCompleted: true,
          cuid: commentObj.cuid,
        },
        { where: { regNo, coreDomain, roundNo }, transaction: chain }
      );

      if (roundModelUpdate == 0) {
        throw Error("Cannot update exception in Round Table");
      }
      response(
        res,
        true,
        "",
        "Succesfully updated exception for the candidate."
      );
    });
  } catch (err) {
    logger.error(`Failure to postException due to ${err}`);
    response(res, false, "", err.toString());
  }
};

module.exports = {
  meetingCandidateHistory,
  fetchMeetings,
  round1Amc,
  round2Amc,
  round3Amc,
  fetchProjects,
  postException,
};

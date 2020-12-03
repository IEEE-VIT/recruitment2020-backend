/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const slotModel = require("../models/slotModel");
const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");
const db = require("../utils/db");
const response = require("../utils/genericResponse");
const constants = require("../utils/constants");
const emailer = require("../utils/emailer");
const templates = require("../utils/templates");
const logger = require("../configs/winston");

moment.tz.setDefault("Asia/Calcutta");

const getSlots = async (req, res) => {
  const todayDate = moment().format("YYYY-MM-DD");
  const todayTime = moment().format("HH:mm:ss");

  slotModel
    .findAll({
      where: {
        [Op.or]: [
          {
            count: { [Op.lt]: constants.round2MaxCandidatesPerMgmtSlot },
            roundNo: "2",
            date: { [Op.gt]: todayDate },
          },
          {
            count: { [Op.lt]: constants.round2MaxCandidatesPerMgmtSlot },
            roundNo: "2",
            date: todayDate,
            timeFrom: { [Op.gte]: todayTime },
          },
        ],
      },
    })
    .then((slot) => {
      if (slot == "") {
        response(res, true, "", "No Slots available");
      } else {
        response(res, true, slot, "Slots Sent");
      }
    })
    .catch((err) => {
      logger.error(`Failure to getSlots due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const selectSlot = async (req, res) => {
  try {
    const result = await db.transaction(async (t) => {
      const userData = await userModel.findOne(
        { where: { regNo: req.user.regNo } },
        { transaction: t }
      );

      if (userData == null) {
        throw new Error("No such User exists");
      }

      const slotData = await slotModel.findOne(
        { where: { suid: req.body.suid, roundNo: "2" } },
        { transaction: t }
      );

      if (slotData == null) {
        throw new Error("No such Slot exists");
      }

      const roundData = await roundModel.findOne({
        where: {
          roundNo: "2",
          regNo: req.user.regNo,
          coreDomain: constants.Mgmt,
        },
      });

      if (roundData == null) {
        throw new Error("No such user exists in given round");
      }

      await roundModel.update(
        { suid: req.body.suid },
        {
          where: {
            roundNo: "2",
            regNo: userData.regNo,
            coreDomain: constants.Mgmt,
          },
        },
        { transaction: t }
      );

      const updatedSlot = await slotModel.update(
        { count: slotData.count + 1 },
        { where: { suid: req.body.suid } },
        { transaction: t }
      );
      if (updatedSlot == 0) {
        throw new Error("Error updating slot");
      }

      return updatedSlot;
    });

    response(res, true, result, "User added to slot");
  } catch (err) {
    logger.error(`Failure to selectSlot due to ${err}`);
    response(res, false, "", err.toString());
  }
};

const fetchGdp = (req, res) => {
  roundModel
    .findOne({
      include: slotModel,
      where: {
        roundNo: "2",
        regNo: req.user.regNo,
        coreDomain: constants.Mgmt,
      },
    })
    .then((result) => {
      response(res, true, result.Slot, "Found GDP");
    })
    .catch((err) => {
      logger.error(`Failure to fetchGdp due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const fetchGda = async (req, res) => {
  roundModel
    .findOne({
      include: adminModel,
      where: {
        roundNo: "2",
        regNo: req.user.regNo,
        coreDomain: constants.Mgmt,
      },
    })
    .then((result) => {
      if (result.length === 0) {
        response(res, true, result.Admin, "No GDA Found!");
      } else {
        response(res, true, result.Admin, "Found GDA");
      }
    })
    .catch((err) => {
      logger.error(`Failure to fetchGda due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const setGdp = async (req, res) => {
  slotModel
    .update(
      {
        gdpLink: req.body.gdpLink,
      },
      {
        where: {
          suid: req.body.suid,
        },
      }
    )
    .then((data) => {
      if (data > 0) {
        response(res, true, "", "GDP Updated Successfully!");
      } else {
        response(res, true, "", "Error updating GDP!");
      }
    })
    .catch((err) => {
      logger.error(`Failure to setGdp due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const setGda = async (req, res) => {
  const { candidates } = req.body;

  try {
    await db.transaction(async (chain) => {
      for (let i = 0; i < candidates.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const roundModelUpdate = await roundModel.update(
          { auid: req.user.auid },
          {
            where: {
              roundNo: "2",
              coreDomain: constants.Mgmt,
              regNo: candidates[i],
            },
            transaction: chain,
          }
        );
        if (roundModelUpdate == 0) {
          throw Error(
            `Unable to update gda for the candidate ${candidates[i]}`
          );
        }
      }
      response(res, true, "", "GDA Successfully set for Candidates!");
    });
  } catch (err) {
    logger.error(`Failure to setGda due to ${err}`);
    response(res, false, "", err.toString());
  }
};

const selectR2TechDsnCandidate = async (req, res) => {
  const { regNo, suid, coreDomain } = req.body;
  const { auid } = req.user;

  try {
    await db.transaction(async (chain) => {
      const roundModelDetails = await roundModel.findOne({
        include: [userModel, slotModel],
        where: { regNo, roundNo: "2", coreDomain },
      });
      if (roundModelDetails.length === 0) {
        throw Error("No such candidate found!");
      }
      const roundUpdate = await roundModel.update(
        {
          auid,
          suid,
        },
        {
          where: {
            regNo,
            roundNo: "2",
            coreDomain,
          },
          transaction: chain,
        }
      );
      if (roundUpdate == 0) {
        throw Error("Unable to update the candidate with the data");
      }
      const admin = await adminModel.findOne({ where: auid });
      if (admin.length == 0) {
        throw Error("No admin found with such auid");
      }
      const slotDetails = await slotModel.findOne({ where: { suid } });
      if (slotDetails.length === 0) {
        throw Error("Unable to find such slots ");
      }
      const userDetails = roundModelDetails.User;
      const candidateEmailId = [userDetails.email];
      const template = templates.round2Interview(
        userDetails.name,
        slotDetails.date,
        slotDetails.timeFrom,
        admin.meetLink
      );
      const email = await emailer(template, candidateEmailId);
      console.log(email);
      if (!email.success) {
        throw Error(
          `Unable to send the email to the candidate because: ${email.error}`
        );
      }
      response(res, true, "", "Candidate Intrview Email Sent!");
    });
  } catch (err) {
    logger.error(`Failure to selectR2TechDsnCandidate due to ${err}`);
    response(res, false, "", err.toString());
  }
};

const verifyslotTime = async (req, res) => {
  roundModel
    .findOne({
      where: {
        regNo: req.user.regNo,
        roundNo: "2",
        coreDomain: constants.Mgmt,
      },
    })
    .then((data) => {
      if (data == null) {
        throw new Error("Invalid Registration Number in the given round");
      }
      slotModel
        .findOne({ where: { suid: data.suid, roundNo: "2" } })
        .then((slot) => {
          if (slot == null) {
            throw new Error("Invalid Slot");
          }
          const todayDate = moment().format("YYYY-MM-DD");
          const todayTime = moment().format("HH:mm:ss");
          if (
            todayDate == slot.date &&
            todayTime >= slot.timeFrom &&
            todayTime <= slot.timeTo
          ) {
            response(res, true, true, "Slot Time Verified");
          } else {
            response(res, true, false, "Slot Time Incorrect");
          }
        })
        .catch((err) => {
          logger.error(`Failure to verifyslotTime Round2 Mgmt due to ${err}`);
          response(res, false, "", err.toString());
        });
    })
    .catch((err) => {
      logger.error(`Failure to verifyslotTime Round2 due to ${err}`);
      response(res, false, "", err.toString());
    });
};

module.exports = {
  setGdp,
  setGda,
  getSlots,
  selectSlot,
  fetchGda,
  fetchGdp,
  selectR2TechDsnCandidate,
  verifyslotTime,
};

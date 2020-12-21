/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const slotModel = require("../../models/slotModel");
const roundModel = require("../../models/roundModel");
const userModel = require("../../models/userModel");
const adminModel = require("../../models/adminModel");
const slotLimitModel = require("../../models/slotLimitModel");
const db = require("../../utils/db");
const response = require("../../utils/genericResponse");
const constants = require("../../utils/constants");
const logger = require("../../configs/winston");

moment.tz.setDefault("Asia/Calcutta");

const getSlots = async (req, res) => {
  const todayDate = moment().format("YYYY-MM-DD");
  const todayTime = moment().format("HH:mm:ss");

  await slotLimitModel
    .findOne({ where: { roundNo: "2" } })
    .then((slotLimit) => {
      if (slotLimit === null) {
        throw new Error("Slots will be sent asap the limit is set");
      } else {
        slotModel
          .findAll({
            where: {
              [Op.or]: [
                {
                  count: { [Op.lt]: slotLimit.maxCandidates },
                  roundNo: "2",
                  mgmt: true,
                  date: { [Op.gt]: todayDate },
                },
                {
                  count: { [Op.lt]: slotLimit.maxCandidates },
                  roundNo: "2",
                  date: todayDate,
                  mgmt: true,
                  timeFrom: { [Op.gte]: todayTime },
                },
              ],
            },
            order: [
              ["date", "ASC"],
              ["timeFrom", "ASC"],
            ],
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
      if (result.Admin == null) {
        response(res, true, { meetlink: null }, "No GDA Found!");
      } else {
        response(res, true, result.Admin, "Found GDA");
      }
    })
    .catch((err) => {
      logger.error(`Failure to fetchGda due to ${err}`);
      response(res, false, "", err.toString());
    });
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
          const todayDate = moment().format("DD MMM");
          const todayTime = moment().format("HH:mm");
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
  getSlots,
  selectSlot,
  fetchGda,
  fetchGdp,
  verifyslotTime,
};

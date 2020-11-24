/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const slotModel = require("../models/slotModel");
const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");
const db = require("../utils/db");

const response = require("../utils/genericResponse");

const getSlots = async (req, res) => {
  const todayDate = new Date().toISOString().slice(0, 10);
  const todayTime = new Date().toLocaleTimeString("it-IT", { hour12: false });

  slotModel
    .findAll({
      where: {
        [Op.or]: [
          {
            count: { [Op.lt]: 20 },
            roundNo: "2",
            date: { [Op.gt]: todayDate },
          },
          {
            count: { [Op.lt]: 20 },
            roundNo: "2",
            date: todayDate,
            timeFrom: { [Op.gte]: todayTime },
          },
        ],
      },
    })
    .then((slot) => {
      if (slot == "") {
        response(res, true, "", "All Slots Filled");
      } else {
        response(res, true, slot, "Slots Sent");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const selectSlot = async (req, res) => {
  try {
    const result = await db.transaction(async (t) => {
      const userData = await userModel.findOne(
        { where: { regNo: req.body.regNo } },
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

      const roundData = await roundModel.findOne(
        {
          where: {
            roundNo: "2",
            regNo: userData.regNo,
            domain: "MGMT",
          },
        },
        { transaction: t }
      );

      if (roundData) {
        throw new Error("User already in Round 2");
      }

      await roundModel.create(
        {
          roundNo: "2",
          regNo: userData.regNo,
          suid: slotData.suid,
          status: "PR",
          domain: "MGMT",
        },
        { transaction: t }
      );

      const updatedSlot = await slotModel.update(
        { count: slotData.count + 1 },
        { where: { suid: req.body.suid } },
        { transaction: t }
      );

      return updatedSlot;
    });

    response(res, true, result, "Added to Round 2");
  } catch (err) {
    response(res, false, "", err.toString());
  }
};

const fetchGdp = (req, res) => {
  roundModel
    .findOne({
      include: slotModel,
      where: {
        roundNo: "2",
        regNo: req.body.regNo,
        domain: "MGMT",
      },
    })
    .then((result) => {
      console.log(result);
      response(res, true, result.Slot, "Found GDP");
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const fetchGda = async (req, res) => {
  roundModel
    .findOne({
      include: adminModel,
      where: {
        roundNo: "2",
        regNo: req.body.regNo,
        domain: "MGMT",
      },
    })
    .then((result) => {
      console.log(result);
      response(res, true, result.Admin, "Found GDA");
    })
    .catch((err) => {
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
      response(res, false, "", err.toString());
    });
};

module.exports = {
  setGdp,
  getSlots,
  selectSlot,
  fetchGda,
  fetchGdp,
};

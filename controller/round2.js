/* eslint-disable eqeqeq */
const { Op } = require("sequelize");
const slotModel = require("../models/slotModel");
const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");
const db = require("../utils/db");
const response = require("../utils/genericResponse");
const constants = require("../utils/constants");

const getSlots = async (req, res) => {
  const todayDate = new Date().toISOString().slice(0, 10);
  const todayTime = new Date().toLocaleTimeString("it-IT", { hour12: false });

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

const setGda = async (req, res) => {
  const { candidates, auid } = req.body;

  try {
    await db.transaction(async (chain) => {
      for (let i = 0; i < candidates.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        const roundModelUpdate = await roundModel.update(
          { auid },
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
    response(res, false, "", err.toString());
  }
};

module.exports = {
  setGdp,
  setGda,
  getSlots,
  selectSlot,
  fetchGda,
  fetchGdp,
};

/* eslint-disable eqeqeq */
const { Op, Sequelize } = require("sequelize");
const logger = require("../../../configs/winston");
const adminModel = require("../../../models/adminModel");
const roundModel = require("../../../models/roundModel");
const userModel = require("../../../models/userModel");
const slotModel = require("../../../models/slotModel");
const response = require("../../../utils/genericResponse");
const constants = require("../../../utils/constants");
const db = require("../../../utils/db");

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
            coreDomain: constants.Mgmt,
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
      logger.error(`Failure to fetchMgmtRound2Candidates due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const fetchGdpCandidates = async (req, res) => {
  roundModel
    .findAll({
      attributes: ["id", "roundNo", "suid", "auid"],
      include: userModel,
      where: {
        [Op.and]: [
          req.query,
          {
            meetingCompleted: false,
            coreDomain: constants.Mgmt,
            roundNo: "2",
            auid: { [Op.is]: null },
          },
        ],
      },
    })
    .then((result) => {
      if (result.length === 0) {
        response(res, true, "", "No candidates found!");
      } else {
        response(res, true, result, "Candidates found!");
      }
    })
    .catch((err) => response(res, false, "", err.toString()));
};

const fetchGdaCandidates = async (req, res) => {
  const { auid } = req.query;
  roundModel
    .findAll({
      attributes: ["id", "roundNo", "suid", "auid"],
      include: userModel,
      where: {
        [Op.and]: [
          req.query,
          {
            status: constants.PendingReview,
            meetingCompleted: false,
            coreDomain: constants.Mgmt,
            roundNo: "2",
            auid,
          },
        ],
      },
    })
    .then((results) => {
      if (results.length === 0) {
        response(res, true, "", "No Meetings found!");
      } else {
        response(res, true, results, "Meetings found!");
      }
    })
    .catch((err) => response(res, false, "", err.toString()));
};

const fetchOnGoingGda = async (req, res) => {
  const dataParsing = async (roundData) => {
    const adminList = [];
    const finalData = [];
    roundData.map((rounds) => {
      if (!adminList.includes(rounds.Admin.auid)) {
        finalData.push(rounds);
        adminList.push(rounds.Admin.auid);
      }
      return rounds;
    });
    return finalData;
  };
  roundModel
    .findAll({
      include: [adminModel, { model: slotModel, include: adminModel }],
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("Round.auid")), "Round.auid"],
      ].concat(Object.keys(roundModel.rawAttributes)),
      where: {
        [Op.and]: [
          {
            meetingCompleted: false,
            roundNo: "2",
            auid: { [Op.ne]: null },
            coreDomain: constants.Mgmt,
          },
          req.query,
        ],
      },
    })
    .then(async (data) => {
      if (data.length === 0) {
        response(res, true, false, "Unable to find any ongoing meetings");
      } else {
        const finalParsedData = await dataParsing(data);
        response(res, true, finalParsedData, "Meetings Found!");
      }
    })
    .catch((err) => {
      response(res, false, false, err.toString());
    });
};

const fetchOccupiedMgmtSlots = async (req, res) => {
  slotModel
    .findAll({
      include: adminModel,
      where: {
        mgmt: true,
        auid: { [Op.ne]: null },
      },
    })
    .then((results) => {
      if (results.length === 0) {
        response(res, true, "", "No slots found!");
      } else {
        response(res, true, results, "Slots found!");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const fetchUnoccupiedMgmtSlots = async (req, res) => {
  slotModel
    .findAll({
      where: {
        mgmt: true,
        auid: { [Op.is]: null },
      },
    })
    .then((results) => {
      if (results.length === 0) {
        response(res, true, "", "No slots found!");
      } else {
        response(res, true, results, "Slots found!");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const setGdp = async (req, res) => {
  const { auid } = req.user;
  slotModel
    .update(
      {
        auid,
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
    logger.error(`Failure to setGda due to ${err}`);
    response(res, false, "", err.toString());
  }
};

module.exports = {
  fetchMgmtRound2Candidates,
  fetchGdpCandidates,
  fetchGdaCandidates,
  fetchOnGoingGda,
  fetchOccupiedMgmtSlots,
  fetchUnoccupiedMgmtSlots,
  setGda,
  setGdp,
};

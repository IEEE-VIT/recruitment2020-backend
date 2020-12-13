const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const slotModel = require("../models/slotModel");
const adminModel = require("../models/adminModel");
const answerModel = require("../models/answerModel");
const questionsModel = require("../models/questionModel");
const projectsModel = require("../models/projectModel");
const response = require("../utils/genericResponse");
const constants = require("../utils/constants");

const dashboard = async (req, res) => {
  const { regNo } = req.user;
  try {
    const qualifiedRounds = [];
    const slots = {};
    const domainAdder = (roundData) => {
      if (
        roundData.status === constants.AcceptedReview &&
        !qualifiedRounds.includes(roundData.coreDomain)
      ) {
        qualifiedRounds.push(roundData.domain);
      }
    };

    const resultData = {
      round0Status: false,
      round1Status: constants.PendingReview,
      round2Status: constants.PendingReview,
      round3Status: constants.PendingReview,
      qualifiedRounds: [],
      slots: {
        round1: {},
        round2: {},
        round3: {},
      },
      user: {},
    };
    const userData = await userModel.findOne({ where: { regNo } });
    resultData.user = userData;
    const roundModelData = await roundModel.findAll({
      include: [slotModel, userModel, adminModel, projectsModel],
      order: ["roundNo"],
      where: { regNo },
    });
    if (roundModelData.length === 0) {
      response(res, true, resultData, "Did not submit round0 form");
      return;
    }
    roundModelData.map((roundData) => {
      switch (roundData.roundNo) {
        case "0":
          resultData.round0Status = true;
          domainAdder(roundData);
          slots.round1 = roundData.Slot == null ? false : roundData.Slot;
          break;
        case "1":
          resultData.round0Status = true;
          resultData.round1Status = roundData.status;
          domainAdder(roundData);
          slots.round1 = roundData.Slot == null ? false : roundData.Slot;
          break;
        case "2":
          resultData.round0Status = true;
          resultData.round2Status = roundData.status;
          domainAdder(roundData);
          slots.round2 = roundData.Slot == null ? false : roundData.Slot;
          break;
        case "3":
          resultData.round0Status = true;
          resultData.round3Status = roundData.status;
          domainAdder(roundData);
          slots.round3 = roundData.Slot == null ? false : roundData.Slot;
          break;
        default:
          break;
      }
      return roundData;
    });
    resultData.slots = slots;
    resultData.qualifiedRounds = qualifiedRounds;
    response(res, true, resultData, "User details");
  } catch (error) {
    response(res, false, "", error.toString());
  }
};

const amcFetch = async (req, res) => {
  const { regNo } = req.query;
  try {
    const round2Data = [];
    const resultData = {
      user: {},
      round0Data: {},
      round1Data: {},
      round2Data: {},
      round3Data: {},
    };
    const answerData = await answerModel.findAll({
      include: [{ model: questionsModel, attributes: ["question"] }],
      attributes: ["answer"],
      where: { regNo },
    });
    const userData = await userModel.findOne({ where: { regNo } });
    const roundModelData = await roundModel.findAll({
      include: [adminModel, slotModel],
      where: { regNo },
    });
    resultData.user = userData;
    resultData.round0Data = answerData;
    roundModelData.map((roundData) => {
      switch (roundData.roundNo) {
        case "0":
          break;
        case "1":
          resultData.round1Data = roundData;
          break;
        case "2":
          round2Data.push(roundData);
          break;
        case "3":
          resultData.round3Data = roundData;
          break;
        default:
          break;
      }
      return roundData;
    });
    resultData.round2Data = round2Data;
    response(res, true, resultData, "User data found!");
  } catch (error) {
    response(res, false, "", error.toString());
  }
};

module.exports = { dashboard, amcFetch };

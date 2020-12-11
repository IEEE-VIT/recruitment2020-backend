const roundModel = require("../models/roundModel");
const userModel = require("../models/userModel");
const slotModel = require("../models/slotModel");
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
      include: slotModel,
      order: ["roundNo"],
      where: { regNo },
    });
    if (roundModelData.length === 0) {
      response(res, true, "", "Invalid User");
    }
    roundModelData.map((roundData) => {
      switch (roundData.roundNo) {
        case "0":
          resultData.round0Status = true;
          domainAdder(roundData);
          slots.round1 = roundData.Slot ?? false;
          break;
        case "1":
          resultData.round1Status = roundData.status;
          domainAdder(roundData);
          slots.round1 = roundData.Slot ?? false;
          break;
        case "2":
          resultData.round2Status = roundData.status;
          domainAdder(roundData);
          slots.round2 = roundData.Slot ?? false;
          break;
        case "3":
          resultData.round3Status = roundData.status;
          domainAdder(roundData);
          slots.round3 = roundData.Slot ?? false;
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

module.exports = { dashboard };

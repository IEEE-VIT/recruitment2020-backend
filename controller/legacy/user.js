const roundModel = require("../../models/roundModel");
const response = require("../../utils/genericResponse");
const logger = require("../../configs/winston");

const userStatus = async (req, res) => {
  roundModel
    .findAll({
      order: ["roundNo"],
      where: {
        regNo: req.user.regNo,
      },
    })
    .then((data) => {
      const latestRound = data[0].roundNo;
      const resultformed = {};
      const round2Data = [];
      resultformed.latestRound = latestRound;
      switch (latestRound) {
        case "2":
          data.forEach((roundData) => {
            if (roundData.roundNo === "2") {
              round2Data.push(roundData);
            }
          });
          resultformed.roundsData = round2Data;
          break;
        case "1":
        case "0":
          resultformed.roundData = data;
          break;
        case "3":
          resultformed.roundData = [];
          break;
        default:
          resultformed.latestRound = "Unkown Round";
      }
      if (data.length === 0) {
        response(res, true, data, "User does not exists");
      } else {
        response(res, true, resultformed, "History found for the candidate!");
      }
    })
    .catch((err) => {
      logger.error(`Failure to getUserStatus due to ${err}`);
      response(res, false, "", err.toString());
    });
};

module.exports = { userStatus };

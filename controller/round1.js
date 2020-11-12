const userModel = require("../models/userModel");
const roundModel = require("../models/roundModel");
const response = require("../utils/genericResponse");

const updateProjectLink = async (req, res) => {
  userModel
    .update(
      { projectLink: req.body.projectLink },
      { where: { regNo: req.body.regNo } }
    )
    .then((result) => {
      if (result == 0) {
        response(res, true, result, "User not found");
      } else {
        response(res, true, result, "User Project updated");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const fetchReadyCandidates = async (req, res) => {
  roundModel
    .findAll({
      attributes: ["regNo"],
      include: userModel,
      where: {
        roundNo: "1",
        meetingCompleted: false,
      },
    })
    .then(result => {
      if (result.length === 0 ) {
        response(res, true, result, "No Ready candidates for Round 1 found");
      } else {
        response(res, true, result, "Ready candidates for Round 1 found");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

module.exports = { updateProjectLink, fetchReadyCandidates };

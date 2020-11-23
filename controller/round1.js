const userModel = require("../models/userModel");
const roundModel = require("../models/roundModel");
const response = require("../utils/genericResponse");
const db = require("../utils/db");

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
    .then((result) => {
      if (result.length === 0) {
        response(res, true, result, "No Ready candidates for Round 1 found");
      } else {
        response(res, true, result, "Ready candidates for Round 1 found");
      }
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

const selectReadyCandidates = async (req, res) => {
  const chain_transaction = await db.transaction();
  try {
    const candidates = req.body.candidates;
    const admin_id = req.body.auid;
    let candidate;
    for (candidate of candidates) {
      const result = await roundModel.update(
        {
          auid: admin_id,
        },
        {
          where: {
            regNo: candidate,
          },
          transaction: chain_transaction,
        }
      );
      if (result == 0) {
        throw "Unable to update with admin, please resend the candidates list";
      }
    }
    await chain_transaction.commit();
    response(
      res,
      true,
      "All Candidates have been assigned",
      "Candidates Selected to interview!"
    );
  } catch (err) {
    await chain_transaction.rollback();
    response(res, false, "", err.toString());
  }
};

const isReady = async (req, res) => {
  roundModel
    .findOne({ where: { regNo: req.body.regNo, roundNo: "0" } })
    .then((data) => {
      roundModel
        .create({
          roundNo: "1",
          regNo: data.regNo,
          suid: data.suid,
          status: "PR",
          domain: data.domain,
        })
        .then((round) => {
          response(res, true, round, "Added to Round 1");
        })
        .catch((err) => {
          response(res, false, "", err.toString());
        });
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

module.exports = {
  updateProjectLink,
  fetchReadyCandidates,
  isReady,
  selectReadyCandidates,
};

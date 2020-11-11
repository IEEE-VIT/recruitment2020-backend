const userModel = require("../models/userModel");
const response = require("../utils/genericResponse");

const updateProjectLink = (req, res) => {
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


module.exports = {updateProjectLink}
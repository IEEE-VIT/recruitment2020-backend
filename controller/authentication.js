const authMiddlewaare = require("../middleware/authentication");
const userModel = require("../models/userModel");
const response = require("../utils/genericResponse");

const login = async (req, res) => {
  const { regNo, password } = req.body;
  if (regNo && password) {
    userModel
      .findOne({
        where: { regNo: regNo },
      })
      .then((user) => {
        if (user.password === password) {
          let payload = { regNo: user.regNo };
          authMiddlewaare.generateJwtToken(
            payload,
            res,
            "",
            "User Authenticated Successfully!"
          );
        } else {
          response(res, true, "", "Incorrect Password!");
        }
      })
      .catch((err) => {
        console.log(err);
        response(res, false, "", "Invalid User!");
      });
  }
};

const register = async (req, res) => {
  userModel
    .create({
      regNo: req.body.regNo,
      name: req.body.name,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
      password: req.body.password,
      coreDomain: req.body.coreDomain,
      specificDomains: req.body.specificDomains,
    })
    .then((user) => {
      let payload = { regNo: user.regNo };
      authMiddlewaare.generateJwtToken(
        payload,
        res,
        user,
        "User created successfully!"
      );
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

module.exports = { login, register };

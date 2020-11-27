const authMiddlewaare = require("../middleware/authentication");
const userModel = require("../models/userModel");
const response = require("../utils/genericResponse");

const login = async (req, res) => {
  const { regNo, password } = req.body;
  if (regNo && password) {
    userModel
      .findOne({
        where: { regNo },
      })
      .then(async (user) => {
        const validPassword = await user.isValidPassword(password);
        if (validPassword) {
          const payload = { regNo: user.regNo };
          authMiddlewaare.generateJwtToken(
            payload,
            res,
            user,
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
  console.log(req.body);
  userModel
    .create({
      regNo: req.body.regNo,
      name: req.body.name,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
      password: req.body.password,
      coreDomains: req.body.coreDomains,
      specificDomains: req.body.specificDomains,
    })
    .then((user) => {
      const payload = { regNo: user.regNo };
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

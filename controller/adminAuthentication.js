const authMiddlewaare = require("../middleware/authentication");
const adminModel = require("../models/adminModel");
const response = require("../utils/genericResponse");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    adminModel
      .findOne({
        where: { email },
      })
      .then(async (admin) => {
        const validPassword = await admin.isValidPassword(password);
        if (validPassword) {
          const payload = { email: admin.email, auid: admin.auid };
          authMiddlewaare.generateJwtToken(
            payload,
            res,
            admin,
            "admin Authenticated Successfully!"
          );
        } else {
          response(res, true, "", "Incorrect Password!");
        }
      })
      .catch((err) => {
        console.log(err);
        response(res, false, "", "Invalid admin!");
      });
  }
};

const register = async (req, res) => {
  adminModel
    .create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    })
    .then((admin) => {
      const payload = { email: admin.email, auid: admin.auid };
      authMiddlewaare.generateJwtToken(
        payload,
        res,
        admin,
        "admin created successfully!"
      );
    })
    .catch((err) => {
      response(res, false, "", err.toString());
    });
};

module.exports = { login, register };

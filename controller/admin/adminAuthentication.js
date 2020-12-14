const authMiddlewaare = require("../../middleware/authentication");
const adminModel = require("../../models/adminModel");
const response = require("../../utils/genericResponse");
const logger = require("../../configs/winston");

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
          if (admin.isActive) {
            authMiddlewaare.generateJwtToken(
              payload,
              res,
              admin,
              "admin authenticated Successfully!"
            );
          } else {
            response(res, false, false, "You need to be approved yet!");
          }
        } else {
          response(res, true, false, "Incorrect Password!");
        }
      })
      .catch((err) => {
        logger.error(`Failure to loginAdmin due to ${err}`);
        response(res, false, false, "Invalid admin!");
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
    .then(() => {
      response(res, true, true, "admin created successfully!");
    })
    .catch((err) => {
      logger.error(`Failure to registerAdmin due to ${err}`);
      response(res, false, false, err.toString());
    });
};

module.exports = { login, register };

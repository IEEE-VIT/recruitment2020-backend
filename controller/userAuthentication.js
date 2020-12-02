/* eslint-disable eqeqeq */
const moment = require("moment-timezone");
const authMiddlewaare = require("../middleware/authentication");
const userModel = require("../models/userModel");
const forgotPasswordModel = require("../models/forgotPasswordModel");
const emailer = require("../utils/emailer");
const db = require("../utils/db");
const response = require("../utils/genericResponse");

moment.tz.setDefault("Asia/Calcutta");

const login = async (req, res) => {
  const { regNo, password } = req.body;
  if (regNo && password) {
    userModel
      .findOne({
        where: { regNo },
      })
      .then(async (user) => {
        if (user == null) {
          throw new Error("Invalid User");
        }
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

const generateOtpAndTime = () => {
  return {
    otp: Math.floor(100000 + Math.random() * 900000),
    time: moment().add(10, "minutes"),
  };
};

const forgetPasswordEmailer = async (generatedOtpAndTime, emailId) => {
  const emailIdParsed = [emailId];
  const template = "";
  const emailResult = await emailer(template, emailIdParsed);
  return emailResult;
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const userData = await userModel.findOne({ where: { email } });
    if (userData.length === 0) {
      throw Error("No such email registered!");
    }
    const forgotPasswordData = await forgotPasswordModel.findOne({
      where: { regNo: userData.regNo },
    });
    await db.transaction(async (chain) => {
      if (forgotPasswordData.length === 0) {
        const generatedCreds = generateOtpAndTime();
        const newForgotPasswordData = await forgotPasswordModel.create(
          {
            regNo: userData.regNo,
            expiry: generatedCreds.time,
            otp: generatedCreds.otp,
          },
          { transaction: chain }
        );
        if (newForgotPasswordData.length === 0) {
          throw Error("Error generating OTP");
        }
        const emailResult = await forgetPasswordEmailer(
          generatedCreds,
          userData.emailId
        );
        if (!emailResult) {
          throw Error("Unable to send Email, hence aborted operation.");
        }
      } else if (forgotPasswordData.expiry <= moment()) {
        const generatedCreds = generateOtpAndTime();
        const resendForgotPasswordUpdate = await forgotPasswordModel.update(
          {
            expiry: generatedCreds.time,
            otp: generatedCreds.otp,
            resent: false,
          },
          { where: { regNo: userData.regNo }, transaction: chain }
        );
        if (resendForgotPasswordUpdate == 0) {
          throw Error("Unable to updat forget password entry");
        }
        const emailResult = await forgetPasswordEmailer(
          generatedCreds,
          userData.emailId
        );
        if (!emailResult) {
          throw Error("Unable to send Email, hence aborted operation.");
        }
      } else {
        const generatedCreds = generateOtpAndTime();
        if (forgotPasswordData.resent) {
          throw Error("Reset OTP twice, please try later after few mins.");
        } else {
          const resendForgotPasswordUpdate = await forgotPasswordModel.update(
            { otp: generatedCreds.otp, resent: true },
            { where: { regNo: userData.regNo }, transaction: chain }
          );
          if (resendForgotPasswordUpdate == 0) {
            throw Error("Unable to resend OTP");
          }
          const emailResult = await forgetPasswordEmailer(
            generatedCreds,
            userData.emailId
          );
          if (!emailResult) {
            throw Error("Unable to send Email, hence aborted operation.");
          }
        }
      }
    });
  } catch (err) {
    response(res, false, "", err.toString());
  }
};

const resetPassword = async (req, res) => {
  const { otp, emailId, password } = req.body;
  const userData = userModel.findOne({ where: { email: emailId } });
  if (userData.length === 0) {
    response(res, false, "", "No such user exists!");
  }
  try {
    await db.transaction(async (chain) => {
      const forgotPasswordData = await forgotPasswordModel.findOne({
        where: { regNo: userData.regNo },
      });
      if (forgotPasswordData.length === 0) {
        throw Error("OTP Expired!");
      }
      if (forgotPasswordData.expiry < moment()) {
        throw Error("OTP Expired!");
      }
      if (forgotPasswordData.otp !== otp) {
        throw Error("Invalid OTP!");
      }
      const updateUserModel = userModel.update(
        {
          password,
        },
        { where: { regNo: userData.regNo }, transaction: chain }
      );
      if (updateUserModel == 0) {
        throw Error("Unable to reset password");
      }
      const forgetPasswordDestroy = forgotPasswordModel.destroy({
        where: { regNo: userData.regNo },
        transaction: chain,
      });
      if (forgetPasswordDestroy == 0) {
        throw Error("Unable to reset password!");
      }
    });
  } catch (err) {
    response(res, false, "", err.toString());
  }
};

module.exports = { login, register, forgotPassword, resetPassword };

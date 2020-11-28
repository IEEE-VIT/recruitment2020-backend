const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");
const response = require("../utils/genericResponse");

const { ExtractJwt } = passportJWT;

const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

passport.use(
  "userStrategy",
  new JwtStrategy(jwtOptions, (jwtPayload, next) => {
    userModel
      .findOne({
        where: { regNo: jwtPayload.regNo },
      })
      .then((user) => {
        next(null, user);
      })
      .catch((_err) => {
        console.log("Middelware Error", _err);
        next(null, false);
        next(null, false);
      });
  })
);

passport.use(
  "adminStrategy",
  new JwtStrategy(jwtOptions, (jwtPayload, next) => {
    adminModel
      .findOne({
        where: { email: jwtPayload.email, auid: jwtPayload.auid },
      })
      .then((admin) => {
        next(null, admin);
      })
      .catch((_err) => {
        console.log("Middelware Error", _err);
        next(null, false);
        next(null, false);
      });
  })
);

const generateJwtToken = (payload, res, responseData, responseMessage) => {
  const token = jwt.sign(payload, jwtOptions.secretOrKey);
  response(res, true, { token, user: responseData }, responseMessage);
};

module.exports = { generateJwtToken };

const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const userModel = require('../models/userModel');
const response = require('../utils/genericResponse');

const { ExtractJwt } = passportJWT;

const JwtStrategy = passportJWT.Strategy;
const jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

const strategy = new JwtStrategy(jwtOptions, ((jwtPayload, next) => {
  console.log('payload received', jwtPayload);
  userModel.findOne({
    where: { regNo: jwtPayload.regNo },
  })
    .then((user) => {
      next(null, user);
    })
    .catch((_err) => {
      console.log('Middelware Error', _err);
      next(null, false); next(null, false);
    });
}));

passport.use(strategy);

const generateJwtToken = (payload, res, responseData, responseMessage) => {
  const token = jwt.sign(payload, jwtOptions.secretOrKey);
  response(res, true, { token, user: responseData }, responseMessage);
};

module.exports = { generateJwtToken };

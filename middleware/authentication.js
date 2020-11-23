const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const userModel = require("../models/userModel");
const response = require("../utils/genericResponse");

let ExtractJwt = passportJWT.ExtractJwt;

let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

let strategy = new JwtStrategy(jwtOptions, function async (jwt_payload, next) {
  console.log("payload received", jwt_payload);
  userModel.findOne({
      where: {regNo: jwt_payload.regNo}
  })
  .then(user =>{
    next(null, user);
  })
  .catch(err =>{
    next(null, false);next(null, false);
  })
});

passport.use(strategy);


const generateJwtToken = (payload, res, responseData, responseMessage) =>{
    let token = jwt.sign(payload, jwtOptions.secretOrKey);
    response(res, true, { token: token, user: responseData }, responseMessage);
}


module.exports = {generateJwtToken };

const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const userModel = require("../models/userModel");
const response = require("../utils/genericResponse");

let ExtractJwt = passportJWT.ExtractJwt;

let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = "wowwow";

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log("payload received", jwt_payload);
  let user = getUser({ id: jwt_payload.id });
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

const loginMiddleware = async (req, res, next) => {
  const { regNo, password } = req.body;
  if (regNo && password) {
    userModel
      .findOne({
        where: { regNo: regNo },
      })
      .then((user) => {
        if (user.password === password) {
          let payload = { id: user.id };
          let token = jwt.sign(payload, jwtOptions.secretOrKey);
          response(res, true, { token: token }, "Login Successful!");
        } else {
          response(res, true, "", "Incorrect Password!");
        }
      })
      .catch((err) => {
        response(res, false, "", "Invalid User!");
      });
  }
};

module.exports = { loginMiddleware };

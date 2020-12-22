const router = require("express").Router();
const userAuthController = require("../controller/user/userAuthentication");
const adminAuthController = require("../controller/admin/adminAuthentication");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");
const headerAuth = require("../middleware/headerAuth");
const recaptcha = require("../middleware/captcha");

router.post(
  "/login",
  recaptcha,
  validater(schemas.userLogin),
  userAuthController.login
);
router.post(
  "/register",
  recaptcha,
  validater(schemas.userRegister),
  userAuthController.register
);
router.post(
  "/adminlogin",
  validater(schemas.adminLogin),
  adminAuthController.login
);
router.post(
  "/adminregister",
  headerAuth.toRegisterAdmin,
  adminAuthController.register
);
router.post(
  "/forgotPassword",
  recaptcha,
  validater(schemas.forgotPassword),
  userAuthController.forgotPassword
);
router.post(
  "/resetPassword",
  recaptcha,
  validater(schemas.resetPassword),
  userAuthController.resetPassword
);
router.post(
  "/verifyOtp",
  recaptcha,
  validater(schemas.verifyOtp),
  userAuthController.verifyOtp
);
router.get("/verifyEmail", userAuthController.verifyEmail);

module.exports = router;

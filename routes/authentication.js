const router = require("express").Router();
const userAuthController = require("../controller/userAuthentication");
const adminAuthController = require("../controller/adminAuthentication");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");
const headerAuth = require("../middleware/headerAuth");

router.post("/login", validater(schemas.userLogin), userAuthController.login);
router.post(
  "/register",
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
router.post("/forgotPassword", userAuthController.forgotPassword);
router.post("/resetPassword", userAuthController.resetPassword);
router.post("/verifyOtp", userAuthController.verifyOtp);

module.exports = router;

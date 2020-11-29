const router = require("express").Router();
const userAuthController = require("../controller/userAuthentication");
const adminAuthController = require("../controller/adminAuthentication");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");

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
router.post("/adminregister", adminAuthController.register);

module.exports = router;

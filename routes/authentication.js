const router = require("express").Router();
const authController = require("../controller/authentication");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");

router.post("/login", validater(schemas.userLogin), authController.login);
router.post(
  "/register",
  validater(schemas.userRegister),
  authController.register
);

module.exports = router;

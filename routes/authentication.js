const router = require("express").Router();
const userAuthController = require("../controller/userAuthentication");
const adminAuthController = require("../controller/adminAuthentication");

router.post("/login", userAuthController.login);
router.post("/register", userAuthController.register);
router.post("/adminlogin", adminAuthController.login);
router.post("/adminregister", adminAuthController.register);

module.exports = router;

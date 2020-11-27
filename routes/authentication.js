const router = require("express").Router();
const userAuthController = require("../controller/userAuthentication");
const adminAuthController = require("../controller/adminAuthentication");

router.post("/login", userAuthController.login);
router.post("/register", userAuthController.register);
router.post("/admin/login", adminAuthController.login);
router.post("/admin/register", adminAuthController.register);

module.exports = router;

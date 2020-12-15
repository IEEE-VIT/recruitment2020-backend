const router = require("express").Router();
const userController = require("../controller/user/user");
const legacyUserController = require("../controller/legacy/user");

router.get("/userStatus", legacyUserController.userStatus);
router.get("/getresults", userController.getResults);
router.get("/dashboard", userController.dashboard);

module.exports = router;

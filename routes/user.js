const router = require("express").Router();
const userController = require("../controller/user/user");

router.get("/userStatus", userController.userStatus);
router.get("/getresults", userController.getResults);
router.get("/dashboard", userController.dashboard);

module.exports = router;

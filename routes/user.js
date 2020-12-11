const router = require("express").Router();
const userController = require("../controller/user");
const clubbedController = require("../controller/clubbed");

router.get("/userStatus", userController.userStatus);
router.get("/getresults", userController.getResults);
router.get("/dashboard", clubbedController.dashboard);

module.exports = router;

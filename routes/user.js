const router = require("express").Router();
const userController = require("../controller/user");

router.get("/userStatus", userController.userStatus);
router.get("/getresults", userController.getResults);

module.exports = router;

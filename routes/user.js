const router = require("express").Router();
const userController = require("../controller/user");

router.get("/user", userController.readUser);

router.post("/user", userController.createUser);

router.put("/user", userController.updateUser);

router.delete("/user", userController.deleteUser);

router.get("/userStatus", userController.userStatus);
router.get("/getresults", userController.getResults);

module.exports = router;

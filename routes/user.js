const router = require("express").Router();
const userController = require("../controller/user");

router.get("/user", userController.readUser);

router.post("/user", userController.createUser);

router.put("/user", userController.updateUser);

router.delete("/user", userController.deleteUser);

router.get("/user", userController.userStatus);

module.exports = router;

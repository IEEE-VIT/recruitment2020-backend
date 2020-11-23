const router = require("express").Router();
const userController = require("../controller/user");

router.get("/user", userController.readUser);

router.put("/user", userController.updateUser);

router.delete("/user", userController.deleteUser);

module.exports = router;

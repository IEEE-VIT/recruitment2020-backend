const user = require("../controller/user");
const userController = require("../controller/user");
const router = require("express").Router();

router.get("/user", userController.readUser);

router.post("/user", userController.createUser);

router.put("/user", userController.updateUser);

router.delete("/user", userController.deleteUser);

module.exports = router;

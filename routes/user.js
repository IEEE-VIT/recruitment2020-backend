const router = require("express").Router();
const userController = require("../controller/user");
const round1Controller = require("../controller/round1");


router.get("/user", userController.readUser);

router.post("/user", userController.createUser);

router.put("/user", userController.updateUser);

router.delete("/user", userController.deleteUser);

router.post("/r1/project", round1Controller.updateProjectLink);


module.exports = router;

const round0Controller = require("../controller/round0");
const router = require("express").Router();

router.post("/form",round0Controller.userForm);
router.get("/slots", round0Controller.getSlots);
router.post("/question", round0Controller.addQuestion);
router.get("/question", round0Controller.getQuestions);
router.post("/verifyslotTime",round0Controller.verifyslotTime);


module.exports = router;

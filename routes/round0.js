const router = require("express").Router();
const round0Controller = require("../controller/round0");

router.post("/form", round0Controller.userForm);
router.get("/slots", round0Controller.getSlots);
router.get("/question", round0Controller.getQuestions);
router.get("/verifyslotTime", round0Controller.verifyslotTime);

module.exports = router;

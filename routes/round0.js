const router = require("express").Router();
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");
const round0Controller = require("../controller/user/round0");

router.get("/slots", round0Controller.getSlots);
router.get("/allslots", round0Controller.getAllRound1Slots);
router.get("/question", round0Controller.getQuestions);
router.get("/verifyslotTime", round0Controller.verifyslotTime);
router.get("/filledform", round0Controller.filledFormBoolean);
router.get("/filledwhy", round0Controller.filledWhyIEEE);

router.post("/why", round0Controller.whyIEEE);
router.post("/form", validater(schemas.round0form), round0Controller.userForm);

module.exports = router;

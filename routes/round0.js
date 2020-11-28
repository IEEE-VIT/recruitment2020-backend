const router = require("express").Router();
const round0Controller = require("../controller/round0");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");

router.post("/form", validater(schemas.round0form), round0Controller.userForm);
router.get("/slots", round0Controller.getSlots);
router.get("/question", round0Controller.getQuestions);
router.get("/verifyslotTime", round0Controller.verifyslotTime);

module.exports = router;

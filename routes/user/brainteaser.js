const btController = require("../../controller/brainteaser");
const router = require("express").Router();

router.post("/ro/bt", btController.addQuestion);
router.get("/ro/bt", btController.getQuestions);



module.exports = router;

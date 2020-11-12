const btController = require("../../controller/brainteaser");
const router = require("express").Router();

router.get("/ro/bt", btController.getQuestions);


module.exports = router;

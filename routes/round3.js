const router = require("express").Router();
const round3Controller = require("../controller/round3");

router.get("/getresults", round3Controller.getResults);

module.exports = router;

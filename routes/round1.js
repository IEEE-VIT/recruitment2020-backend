const round1Controller = require("../controller/round1");
const router = require("express").Router();

router.post("/ready",round1Controller.isReady);


module.exports = router;

const router = require("express").Router();
const round1Controller = require("../controller/round1");

router.post("/ready", round1Controller.isReady);

module.exports = router;

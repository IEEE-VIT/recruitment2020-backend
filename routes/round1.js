const router = require("express").Router();
const round1Controller = require("../controller/round1");

router.post("/ready", round1Controller.isReady);
router.post("/project", round1Controller.updateProjectLink);

module.exports = router;

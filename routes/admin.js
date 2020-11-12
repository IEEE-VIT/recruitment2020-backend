const router = require("express").Router();
const round1Controller = require("../controller/round1");


router.get("/r1/candidates", round1Controller.fetchReadyCandidates);

module.exports = router;

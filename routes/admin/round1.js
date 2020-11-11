const round1Controller = require("../../controller/round1");
const router = require("express").Router();

router.post("/candidates", round1Controller.fetchReadyCandidates);

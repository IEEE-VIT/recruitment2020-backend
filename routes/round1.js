const round1Controller = require("../controller/round1");
const router = require("express").Router();

router.post("/project", round1Controller.updateProjectLink);

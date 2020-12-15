const router = require("express").Router();
const round1Controller = require("../controller/user/round1");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");

router.get("/ready", round1Controller.isReady);

router.post(
  "/project",
  validater(schemas.round1ProjectLink),
  round1Controller.updateProjectLink
);

module.exports = router;

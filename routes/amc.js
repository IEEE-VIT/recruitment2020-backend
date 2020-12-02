const router = require("express").Router();
const amcController = require("../controller/amc");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");

router.get("/candidate/meetings", amcController.fetchMeetings);
router.get("/candidate", amcController.meetingCandidateHistory);
router.post(
  "/round1Interview",
  validater(schemas.postAmc),
  amcController.round1Amc
);
router.post(
  "/round2Interview",
  validater(schemas.postAmc),
  amcController.round2Amc
);

module.exports = router;

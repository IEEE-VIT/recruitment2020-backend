const router = require("express").Router();
const amcController = require("../controller/admin/amc");
const legacyAmcController = require("../controller/legacy/amc");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");
const isBoard = require("../middleware/boardAuth");

router.get("/candidate/meetings", legacyAmcController.fetchMeetings);
router.get("/candidate", legacyAmcController.meetingCandidateHistory);
router.get("/fetchAmc", amcController.amcFetch);

router.post(
  "/round1Interview",
  validater(schemas.postRoundOneAmc),
  amcController.round1Amc
);
router.post(
  "/round2Interview",
  validater(schemas.postRoundTwoAmc),
  amcController.round2Amc
);
router.post(
  "/round3Interview",
  isBoard,
  validater(schemas.postRoundThreeAmc),
  amcController.round3Amc
);

module.exports = router;

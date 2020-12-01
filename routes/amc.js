const router = require("express").Router();
const amcController = require("../controller/amc");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");

router.get("/candidate/meetings", amcController.fetchMeetings);
router.get("/candidate", amcController.meetingCandidateHistory);
router.post("/interview", validater(schemas.postAmc), amcController.postAmc);

module.exports = router;

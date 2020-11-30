const router = require("express").Router();
const amcController = require("../controller/amc");

router.get("/candidate/meetings", amcController.fetchMeetings);
router.get("/candidate", amcController.meetingCandidateHistory);
router.post("/interview", amcController.postAmc);

module.exports = router;

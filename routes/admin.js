const router = require("express").Router();
const round1Controller = require("../controller/round1");
const adminController = require("../controller/admin.js");
const round2Controller = require("../controller/round2");
const queryFilter = require("../middleware/filter")

router.get("/r1/candidates", round1Controller.fetchReadyCandidates);
router.post("/r1/candidates", round1Controller.selectReadyCandidates);
router.get("/", adminController.readAdmin);
router.put("/", adminController.updateAdmin);
router.get("/r2/tech/candidates", adminController.fetchTechRound2Candidates);
router.get("/r2/mgmt/candidates", adminController.fetchMgmtRound2Candidates);
router.get("/allAdmins", adminController.fetchAllAdmins);
router.get("/allCandidates",queryFilter ,adminController.fetchAllUsers);

router.post("/mgmt/r2/gdp", round2Controller.setGdp);

router.get("/exceptions", adminController.fetchExceptions);
router.post("/exceptions", adminController.resolveExceptions);

module.exports = router;

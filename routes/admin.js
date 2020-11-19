const router = require("express").Router();
const round1Controller = require("../controller/round1");
const adminController=require("../controller/admin.js")

router.get("/r1/candidates", round1Controller.fetchReadyCandidates);
router.get("/", adminController.readAdmin);
router.put("/", adminController.updateAdmin);
router.get("/r2/tech/candidates",adminController.fetchTechRound2Candidates);
router.get("/r2/mgmt/candidates",adminController.fetchMgmtRound2Candidates);
router.get("/all",adminController.fetchAllAdmins);

router.get("/exceptions",adminController.fetchExceptions);
router.post("/exceptions",adminController.resolveExceptions);

module.exports = router;

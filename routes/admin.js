const router = require("express").Router();
const round1Controller = require("../controller/round1");
const adminController = require("../controller/admin.js");
const round2Controller = require("../controller/round2");
const round3Controller = require("../controller/round3");
const queryFilter = require("../middleware/filter");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");
const isBoard = require("../middleware/boardAuth");
const headerAuth = require("../middleware/headerAuth");

router.get("/", adminController.readAdmin);
router.get("/r1/candidates", round1Controller.fetchReadyCandidates);
router.get(
  "/r2/tech/candidates",
  queryFilter,
  adminController.fetchTechRound2Candidates
);
router.get(
  "/r2/mgmt/candidates",
  queryFilter,
  adminController.fetchMgmtRound2Candidates
);
router.get("/allAdmins", queryFilter, isBoard, adminController.fetchAllAdmins);
router.get(
  "/allCandidates",
  queryFilter,
  isBoard,
  adminController.fetchAllUsers
);
router.get("/r3/candidates", isBoard, queryFilter, round3Controller.candidates);
router.get("/exceptions", queryFilter, adminController.fetchExceptions);

router.post(
  "/exceptions",
  validater(schemas.resolveException),
  adminController.resolveExceptions
);
router.post(
  "/mgmt/r2/gdp",
  validater(schemas.round2SetGdp),
  round2Controller.setGdp
);
router.post(
  "/mgmt/r2/gda",
  validater(schemas.round2SetGda),
  round2Controller.setGda
);
router.post("/addslot", headerAuth.toAddSlot, adminController.addSlot);
router.post("/setdeadline", isBoard, adminController.setDeadline);
router.post("/r2/emailCandidate", round2Controller.selectR2TechDsnCandidate);
router.post(
  "/r1/candidates",
  validater(schemas.round1SelectCandidates),
  round1Controller.selectReadyCandidates
);

router.put("/", validater(schemas.adminUpdate), adminController.updateAdmin);

module.exports = router;

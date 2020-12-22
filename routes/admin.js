const router = require("express").Router();
const adminController = require("../controller/admin/admin.js");
const adminRound1Controller = require("../controller/admin/round1.js");
const adminRound2NonMgmtController = require("../controller/admin/round2/r2nonmgmt.js");
const adminRound2MgmtController = require("../controller/admin/round2/r2mgmt.js");
const adminRound3Controller = require("../controller/admin/round3.js");
const adminExceptionController = require("../controller/admin/exceptions");
const queryFilter = require("../middleware/filter");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");
const isBoard = require("../middleware/boardAuth");
const headerAuth = require("../middleware/headerAuth");
const updateController = require("../controller/admin/updates");

router.get("/", adminController.readAdmin);
router.get("/r1/candidates", adminRound1Controller.fetchReadyCandidates);
router.get(
  "/r2/nonmgmt/candidates",
  queryFilter,
  adminRound2NonMgmtController.fetchTechDsnRound2Candidates
);
router.get(
  "/r2/mgmt/candidates",
  queryFilter,
  adminRound2MgmtController.fetchMgmtRound2Candidates
);
router.get("/allAdmins", queryFilter, adminController.fetchAllAdmins);
router.get("/allCandidates", queryFilter, adminController.fetchAllUsers);
router.get(
  "/r3/candidates",
  isBoard,
  queryFilter,
  adminRound3Controller.candidates
);
router.get(
  "/exceptions",
  queryFilter,
  adminExceptionController.fetchExceptions
);
router.get("/meetings", adminController.getAllMeetings);
router.get("/ongoing", adminController.fetchOnGoingMeetings);
router.get("/projects", queryFilter, adminController.fetchProjects);
router.get("/allslots", queryFilter, adminController.getAllSlots);
router.get(
  "/r2/mgmt/fetchGdaCandidates",
  adminRound2MgmtController.fetchGdaCandidates
);
router.get(
  "/r2/mgmt/fetchGdpCandidates",
  adminRound2MgmtController.fetchGdpCandidates
);
router.get(
  "/r2/nonmgmt/fetchMeetings",
  adminRound2NonMgmtController.fetchMyTechDesignMeetings
);

router.get("/r2/nonmgmt/slots", adminRound2NonMgmtController.getRound2Slots);

router.get(
  "/r2/mgmt/fetchUnoccupiedMgmtGdpSlots",
  adminRound2MgmtController.fetchUnoccupiedMgmtSlots
);
router.get(
  "/r2/mgmt/fetchOccupiedMgmtGdpSlots",
  adminRound2MgmtController.fetchOccupiedMgmtSlots
);
router.get(
  "/r2/mgmt/fetchOnGoingGda",
  adminRound2MgmtController.fetchOnGoingGda
);

router.get("/getslotlimit", isBoard, adminController.getslotLimits);

router.post("/slotlimit", isBoard, adminController.updateSlotLimit);

router.post(
  "/exceptions",
  validater(schemas.resolveException),
  adminExceptionController.resolveExceptions
);
router.post(
  "/mgmt/r2/gdp",
  validater(schemas.round2SetGdp),
  adminRound2MgmtController.setGdp
);
router.post(
  "/mgmt/r2/gda",
  validater(schemas.round2SetGda),
  adminRound2MgmtController.setGda
);
router.post("/addslot", headerAuth.toAddSlot, adminController.addSlot);
router.post("/setdeadline", isBoard, adminController.setDeadline);
router.post(
  "/r2/emailCandidate",
  adminRound2NonMgmtController.selectR2TechDsnCandidate
);
router.post(
  "/r1/candidates",
  validater(schemas.round1SelectCandidates),
  adminRound1Controller.selectReadyCandidates
);

router.get("/updates", updateController.getUpdates);
router.post("/updates", updateController.addUpdate);
router.delete("/updates", updateController.deleteUpdate);

router.put("/", validater(schemas.adminUpdate), adminController.updateAdmin);

module.exports = router;

const router = require("express").Router();
const round1Controller = require("../controller/round1");
const adminController = require("../controller/admin.js");
const round2Controller = require("../controller/round2");
const queryFilter = require("../middleware/filter");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");

router.get("/r1/candidates", round1Controller.fetchReadyCandidates);
router.post(
  "/r1/candidates",
  validater(schemas.round1SelectCandidates),
  round1Controller.selectReadyCandidates
);
router.get("/", adminController.readAdmin);
router.put("/", validater(schemas.adminUpdate), adminController.updateAdmin);
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
router.get("/allAdmins", queryFilter, adminController.fetchAllAdmins);
router.get("/allCandidates", queryFilter, adminController.fetchAllUsers);

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

router.get("/exceptions", queryFilter, adminController.fetchExceptions);
router.post(
  "/exceptions",
  validater(schemas.resolveException),
  adminController.resolveExceptions
);

module.exports = router;

const router = require("express").Router();
const round2Controller = require("../controller/round2");
const validater = require("../middleware/validation");
const schemas = require("../utils/schemas");

router.get("/slots", round2Controller.getSlots);
router.get("/fetchgdp", round2Controller.fetchGdp);
router.get("/fetchgda", round2Controller.fetchGda);

router.post(
  "/selectslot",
  validater(schemas.round2SelectSlot),
  round2Controller.selectSlot
);

module.exports = router;

const round2Controller = require("../controller/round2");
const router = require("express").Router();

router.get("/slots", round2Controller.getSlots);
router.post("/selectslot", round2Controller.selectSlot);
router.get("/fetchgdp", round2Controller.fetchGdp);
router.get("/fetchgda", round2Controller.fetchGda);

module.exports = router;

const round2Controller = require("../controller/round2");
const router = require("express").Router();

router.get("/slots",round2Controller.getSlots);
router.post("/selectslot",round2Controller.selectSlot);

module.exports = router;

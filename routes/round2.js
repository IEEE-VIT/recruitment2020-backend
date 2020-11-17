const round2Controller = require("../controller/round2");
const router = require("express").Router();

router.post("/slots",round2Controller.addSlot);
router.get("/slots",round2Controller.getSlots);

module.exports = router;

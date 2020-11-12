const slotController = require("../../controller/r0slots.js");
const router = require("express").Router();

router.post("/r0/slots",slotController.addSlot);
router.get("/r0/slots", slotController.getSlots);



module.exports = router;

const router = require("express").Router();
const middleware = require("../middleware/authentication")


router.post('/login', middleware.loginMiddleware);

module.exports = router;
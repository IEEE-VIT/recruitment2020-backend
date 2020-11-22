const router = require("express").Router();
const middleware = require("../middleware/authentication");
const passport = require("passport");
router.post("/login", middleware.loginMiddleware);
router.get(
  "/testProtectedRoute",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.json({
      msg: `Authorised by ${req.user.name}`,
    });
  }
);

module.exports = router;

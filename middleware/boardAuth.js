module.exports = function isBoard(req, res, next) {
  if (req.user.superUser) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

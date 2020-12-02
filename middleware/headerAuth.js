function toAddSlot(req, res, next) {
  if (req.headers.key === process.env.ADDSLOT_KEY) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

function toRegisterAdmin(req, res, next) {
  if (req.headers.key === process.env.REGISTERADMIN_KEY) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

module.exports = { toAddSlot, toRegisterAdmin };

const { Op } = require("sequelize");

const queryFilter = (req, res, next) => {
  const queries = req.query;
  const arrayList = ["specificDomains", "coreDomains"];
  arrayList.forEach((param) => {
    if (param.toString() in queries) {
      queries[param] = { [Op.contains]: [queries[param]] };
    }
  });
  next();
};

module.exports = queryFilter;

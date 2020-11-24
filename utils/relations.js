const admin = require("../models/adminModel");
const user = require("../models/userModel");
const comment = require("../models/commentModel");
const round = require("../models/roundModel");
const slot = require("../models/slotModel");
const teaserAnswer = require("../models/answerModel");
const teaserQuestion = require("../models/questionModel");
const sequelize = require("./db");

const relations = () => {
  slot.hasMany(round, { foreignKey: "suid" });
  admin.hasMany(round, { foreignKey: "auid" });
  comment.hasMany(round, { foreignKey: "cuid" });
  user.hasMany(round, { foreignKey: "regNo" });
  round.belongsTo(user, { foreignKey: "regNo" });
  round.belongsTo(admin, { foreignKey: "auid" });
  round.belongsTo(slot, { foreignKey: "suid" });
  round.belongsTo(comment, { foreignKey: "cuid" });
  teaserQuestion.belongsTo(teaserAnswer, { foreignKey: "quid" });
  return sequelize;
};

module.exports = relations;

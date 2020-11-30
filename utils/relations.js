const admin = require("../models/adminModel");
const user = require("../models/userModel");
const comment = require("../models/commentModel");
const round = require("../models/roundModel");
const slot = require("../models/slotModel");
const answerModel = require("../models/answerModel");
const questionModel = require("../models/questionModel");
const project = require("../models/projectModel");
const sequelize = require("./db");

const relations = () => {
  slot.hasMany(round, { foreignKey: "suid" });
  admin.hasMany(round, { foreignKey: "auid" });
  comment.hasMany(round, { foreignKey: "cuid" });
  user.hasMany(round, { foreignKey: "regNo" });
  user.belongsTo(project, { foreignKey: "puid" });
  round.belongsTo(user, { foreignKey: "regNo" });
  round.belongsTo(admin, { foreignKey: "auid" });
  round.belongsTo(slot, { foreignKey: "suid" });
  round.belongsTo(comment, { foreignKey: "cuid" });
  questionModel.hasMany(answerModel, { foreignKey: "quid" });
  answerModel.belongsTo(questionModel, { foreignKey: "quid" });
  return sequelize;
};

module.exports = relations;

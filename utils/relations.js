const admin = require("../models/adminModel");
const user = require("../models/userModel");
const comment = require("../models/commentModel");
const round = require("../models/roundModel");
const slot = require("../models/slotModel");
const teaserAnswer = require("../models/teaserAnswerModel");
const teaserQuestion = require("../models/teaserQuestionModel");
const sequelize = require("./db");


function relations(){
    slot.belongsTo(round, {foreignKey: 'suid'});
    admin.belongsTo(round,{foreignKey: 'auid'});
    comment.belongsTo(round, {foreignKey: 'cuid'});
    user.belongsTo(round, {foreignKey: 'regNo'});
    teaserQuestion.belongsTo(teaserAnswer, {foreignKey: 'quid'});
    return sequelize;
}


module.exports = relations();

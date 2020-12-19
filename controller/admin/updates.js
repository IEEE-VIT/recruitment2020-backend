const updatesModel = require("../../models/updateModel");
const response = require("../../utils/genericResponse");
const logger = require("../../configs/winston");

const getUpdates = async (req, res) => {
  updatesModel
    .findAll()
    .then((updates) => {
      if (updates.length === 0) {
        response(res, true, false, "No Updates Available");
      } else {
        response(res, true, updates, "All updates sent");
      }
    })
    .catch((err) => {
      logger.error(`Failure to getUpdates due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const addUpdate = async (req, res) => {
  updatesModel
    .create({
      content: req.body.content,
      date: req.body.date,
      time: req.body.time,
      auid: req.user.auid,
    })
    .then((update) => {
      response(res, true, update, "All updates sent");
    })
    .catch((err) => {
      logger.error(`Failure to addUpdate due to ${err}`);
      response(res, false, "", err.toString());
    });
};

const deleteUpdate = async (req, res) => {
  updatesModel
    .destroy({ where: { uuid: req.body.uuid } })
    .then(() => {
      response(res, true, true, "update deleted");
    })
    .catch((err) => {
      logger.error(`Failure to deleteUpdate due to ${err}`);
      response(res, false, false, err.toString());
    });
};

module.exports = { getUpdates, addUpdate, deleteUpdate };

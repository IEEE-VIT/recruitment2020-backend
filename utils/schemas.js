const Joi = require("joi");

const schemas = {
  userLogin: Joi.object().keys({
    regNo: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

module.exports = schemas;

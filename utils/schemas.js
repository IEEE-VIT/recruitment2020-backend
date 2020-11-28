const Joi = require("joi");

const schemas = {
  userLogin: Joi.object().keys({
    regNo: Joi.string().alphanum().length(9).required(),
    password: Joi.string().min(8).required(),
  }),
  userRegister: Joi.object().keys({
    regNo: Joi.string().alphanum().length(9).required(),
    password: Joi.string().min(8).required(),
    phoneNo: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
  adminLogin: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
  round0form: Joi.object().keys({
    suid: Joi.string()
      .pattern(/^[0-9]+$/)
      .required(),
    questions: Joi.required(),
    coreDomains: Joi.required(),
    specificDomains: Joi.required(),
  }),
  round1ProjectLink: Joi.object().keys({
    projectLink: Joi.string().uri(),
  }),
  round2SelectSlot: Joi.object().keys({
    suid: Joi.string()
      .pattern(/^[0-9]+$/)
      .required(),
  }),
};

module.exports = schemas;

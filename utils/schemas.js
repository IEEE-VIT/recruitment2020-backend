const Joi = require("joi");

const schemas = {
  userLogin: Joi.object().keys({
    regNo: Joi.string()
      .alphanum()
      .length(9)
      .pattern(/^[2][0]([a-zA-Z]){3}([0-9]){4}/)
      .required(),
    password: Joi.string().min(8).required(),
  }),
  userRegister: Joi.object().keys({
    regNo: Joi.string()
      .alphanum()
      .length(9)
      .pattern(/^[2][0]([a-zA-Z]){3}([0-9]){4}/)
      .required(),
    password: Joi.string().min(8).required(),
    phoneNo: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .pattern(/^[a-zA-Z0-9]+[.][a-zA-Z0-9]+(2020)@(vitstudent)\.ac\.in$/)
      .required(),
  }),
  adminLogin: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
  adminUpdate: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(8),
    meetLink: Joi.string().uri(),
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
  round1SelectCandidates: Joi.object().keys({
    candidates: Joi.required(),
  }),
  round2SelectSlot: Joi.object().keys({
    suid: Joi.string()
      .pattern(/^[0-9]+$/)
      .required(),
  }),
  round2SetGdp: Joi.object().keys({
    suid: Joi.string()
      .pattern(/^[0-9]+$/)
      .required(),
    gdpLink: Joi.string().uri(),
  }),
  round2SetGda: Joi.object().keys({
    candidates: Joi.required(),
  }),
  resolveException: Joi.object().keys({
    roundNo: Joi.string()
      .pattern(/^[0-9]+$/)
      .required(),
    regNo: Joi.string()
      .alphanum()
      .length(9)
      .pattern(/^[2][0]([a-zA-Z]){3}([0-9]){4}/)
      .required(),
    coreDomain: Joi.required(),
    reason: Joi.string(),
  }),
  postAmc: Joi.object().keys({
    id: Joi.string().pattern(/^[0-9]+$/),
    comment: Joi.string(),
    status: Joi.string().valid("AR", "ER", "RR", "PR"),
    regNo: Joi.string()
      .alphanum()
      .length(9)
      .pattern(/^[2][0]([a-zA-Z]){3}([0-9]){4}/),
    puid: Joi.string().pattern(/^[0-9]+$/),
  }),
};

module.exports = schemas;

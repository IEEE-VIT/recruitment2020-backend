const Joi = require("joi");
const constants = require("./constants");

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
    email: Joi.string()
      .email()
      .regex(RegExp("[a-zA-Z0-9.]*2020[a|b]?@vitstudent.ac.in"))
      .required(),
    token: Joi.string().required(),
  }),
  forgotPassword: Joi.object().keys({
    email: Joi.string()
      .email()
      .regex(RegExp("[a-zA-Z0-9.]*2020[a|b]?@vitstudent.ac.in"))
      .required(),
  }),
  resetPassword: Joi.object().keys({
    emailId: Joi.string()
      .email()
      .regex(RegExp("[a-zA-Z0-9.]*2020[a|b]?@vitstudent.ac.in"))
      .required(),
    otp: Joi.required(),
    password: Joi.string().min(8).required(),
  }),
  verifyOtp: Joi.object().keys({
    emailId: Joi.string()
      .email()
      .regex(RegExp("[a-zA-Z0-9.]*2020[a|b]?@vitstudent.ac.in"))
      .required(),
    otp: Joi.required(),
  }),
  adminLogin: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
  adminUpdate: Joi.object().keys({
    name: Joi.string(),
    meetLink: Joi.string().pattern(/^(http|https):/),
  }),
  round0form: Joi.object().keys({
    suid: Joi.string()
      .pattern(/^[0-9]+$/)
      .required(),
    phoneNo: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    name: Joi.string().required(),
    questions: Joi.array().items({
      quid: Joi.string().pattern(/^[0-9]+$/),
      answer: Joi.string().allow(""),
    }),
    specificDomains: Joi.array()
      .items(
        constants.App,
        constants.Web,
        constants.Ml,
        constants.CSec,
        constants.ARVR,
        constants.GDes,
        constants.Ui,
        constants.Vfx,
        constants.Elec,
        constants.ThreeD,
        constants.Mgmt,
        constants.Unknown
      )
      .required(),
    coreDomains: Joi.array()
      .items(constants.Mgmt, constants.Tech, constants.Dsn, constants.Unknown)
      .required(),
  }),
  round1ProjectLink: Joi.object().keys({
    projectLink: Joi.string()
      .pattern(/^(http|https):/)
      .required(),
  }),
  round1SelectCandidates: Joi.object().keys({
    candidates: Joi.array()
      .items(Joi.string().pattern(/^[2][0]([a-zA-Z]){3}([0-9]){4}/))
      .required(),
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
    gdpLink: Joi.string()
      .pattern(/^(http|https):/)
      .required(),
  }),
  round2SetGda: Joi.object().keys({
    auid: Joi.string()
      .pattern(/^[0-9]+$/)
      .required(),
    candidates: Joi.array().items(
      Joi.string().pattern(/^[2][0]([a-zA-Z]){3}([0-9]){4}/)
    ),
  }),
  resolveException: Joi.object().keys({
    roundNo: Joi.string().valid("1", "2").required(),
    regNo: Joi.string()
      .alphanum()
      .length(9)
      .pattern(/^[2][0]([a-zA-Z]){3}([0-9]){4}/)
      .required(),
    coreDomain: Joi.string()
      .valid(constants.Mgmt, constants.Tech, constants.Dsn, constants.Unknown)
      .required(),
    reason: Joi.string().required(),
    status: Joi.string()
      .valid(constants.AcceptedReview, constants.RejectedReview)
      .required(),
  }),
  postRoundOneAmc: Joi.object().keys({
    comment: Joi.string(),
    status: Joi.string().valid(
      constants.AcceptedReview,
      constants.PendingReview,
      constants.RejectedReview,
      constants.ExceptionReview
    ),
    eligibleDomains: Joi.array().items(
      Joi.string().valid(
        constants.App,
        constants.Web,
        constants.Ml,
        constants.CSec,
        constants.ARVR,
        constants.GDes,
        constants.Ui,
        constants.Vfx,
        constants.Elec,
        constants.ThreeD,
        constants.Mgmt,
        constants.Unknown
      )
    ),
    regNo: Joi.string()
      .alphanum()
      .length(9)
      .pattern(/^[2][0]([a-zA-Z]){3}([0-9]){4}/),
    puid: Joi.string()
      .pattern(/^[0-9]+$/)
      .required(),
  }),
  postRoundTwoAmc: Joi.object().keys({
    comment: Joi.string(),
    status: Joi.string().valid(
      constants.AcceptedReview,
      constants.PendingReview,
      constants.RejectedReview,
      constants.ExceptionReview
    ),
    coreDomain: Joi.string().valid(
      constants.Mgmt,
      constants.Tech,
      constants.Dsn,
      constants.Unknown
    ),
    specificDomain: Joi.string().valid(
      constants.App,
      constants.Web,
      constants.Ml,
      constants.CSec,
      constants.ARVR,
      constants.GDes,
      constants.Ui,
      constants.Vfx,
      constants.Elec,
      constants.ThreeD,
      constants.Mgmt,
      constants.Unknown
    ),
    regNo: Joi.string()
      .alphanum()
      .length(9)
      .pattern(/^[2][0]([a-zA-Z]){3}([0-9]){4}/),
  }),
  postRoundThreeAmc: Joi.object().keys({
    comment: Joi.string(),
    status: Joi.string().valid(
      constants.AcceptedReview,
      constants.PendingReview,
      constants.RejectedReview,
      constants.ExceptionReview
    ),
    regNo: Joi.string()
      .alphanum()
      .length(9)
      .pattern(/^[2][0]([a-zA-Z]){3}([0-9]){4}/),
  }),
};

module.exports = schemas;

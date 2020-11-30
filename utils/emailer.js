const axios = require("axios");

// eslint-disable-next-line consistent-return
const emailer = async (template, emailIds) => {
  const config = {
    headers: {
      Authorization: process.env.EMAIL_TOKEN,
    },
  };

  if (template === undefined) {
    return { success: false, error: "Empty Template!" };
  }

  const data = {
    from_mail: "IEEE-VIT",
    to_mails: emailIds,
    subject: template.subject,
    body: template.body,
  };
  axios
    .post("", data, config)
    .then((response) => {
      if (response.success) {
        return { success: true, error: "" };
      }
      return { success: false, error: data.error };
    })
    .catch((err) => {
      return { success: false, error: err.toString() };
    });
};

module.exports = { emailer };

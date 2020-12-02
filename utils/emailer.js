const axios = require("axios");

const config = {
  headers: {
    Authorization: process.env.EMAIL_TOKEN,
  },
};

const emailer = async (template, emailIds) => {
  if (template === undefined) {
    return { success: false, error: "Empty Template!" };
  }

  const data = JSON.stringify({
    from_mail: "outreach@ieeevit.org",
    to_mails: emailIds,
    subject: template.subject,
    body: template.body,
  });
  const emailerApi = await axios
    .post("https://ieee-mailer.herokuapp.com/send", data, config)
    .then((response) => {
      if (response.data.success) {
        return { success: true, error: "" };
      }
      return { success: false, error: response.error };
    })
    .catch((err) => {
      return { success: false, error: err.toString() };
    });
  return emailerApi;
};

module.exports = emailer;

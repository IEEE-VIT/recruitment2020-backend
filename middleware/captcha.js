const Recaptcha = require("recaptcha-verify");

const recaptcha = new Recaptcha({
  secret: process.env.RECAPTCHA_KEY,
  verbose: true,
});

const verifyCaptcha = (req, res, next) => {
  try {
    console.log(req.body);
    const { token } = req.body;
    recaptcha.checkResponse(token, function (error, response) {
      if (response.success) {
        console.log("Verified recaptcha");
        next();
        // res.status(200).send({auth: 1, message: "Verified captcha"})
      } else {
        console.log("not verified recaptcha");
        res.status(404).send({ auth: 0, message: "Unathorized" });
      }
    });
  } catch (e) {
    res.send(500).send({ message: "Contact server" });
  }
};

module.exports = verifyCaptcha;

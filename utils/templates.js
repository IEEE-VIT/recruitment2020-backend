const forgotPasswordTempalate = (name, otp, time) => {
  return `Hey ${name}, <br>
    Your Secret OTP for IEEE-Recruitments is: ${otp} <br>
    OTP is valid only valid till ${time}`;
};

module.exports = { forgotPasswordTempalate };

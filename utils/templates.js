const forgotPasswordTempalate = (name, otp, time) => {
  return `Hey ${name}, <br>
    Your Secret OTP for IEEE-Recruitments is: ${otp} <br>
    OTP is valid only valid till ${time}`;
};

const round2Interview = (name, date, time, meetlink) => {
  return `Hey ${name},
    Congratualtaions!, Your IEEE Round 2 Interview is scheduled on ${date} at ${time}
    Please make sure to join this ${meetlink} on time!
    `;
};

module.exports = { round2Interview, forgotPasswordTempalate };

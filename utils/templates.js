const forgotPasswordTempalate = (name, otp, time) => {
  return {
    body: `Hey ${name}, <br>
    Your Secret OTP for IEEE-Recruitments is: ${otp} <br>
    OTP is valid only valid till ${time}`,
    subject: "[IEEE-VIT] Reset Password",
  };
};

const round2Interview = (name, date, time, meetlink) => {
  return {
    body: `Hey ${name},
    Congratualtaions!, Your IEEE Round 2 Interview is scheduled on ${date} at ${time}
    Please make sure to join this ${meetlink} on time!
    `,
    subject: "[IEEE-VIT] Round 2 Interview",
  };
};

module.exports = { round2Interview, forgotPasswordTempalate };

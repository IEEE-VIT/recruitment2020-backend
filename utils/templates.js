const forgotPasswordTempalate = (name, otp, time) => {
  return {
    body: `Hey ${name}, <br>
    Your Secret OTP for IEEE-Recruitments is: ${otp} <br>
    OTP is only valid till ${time}`,
    subject: "[IEEE-VIT] Reset Password",
  };
};

const round2Interview = (name, date, time, meetlink) => {
  return {
    body: `Hey ${name}, <br>
    Congratulations!, Your IEEE Round 2 Interview is scheduled on ${date} at ${time}
    Please make sure to join this ${meetlink} on time!
    `,
    subject: "[IEEE-VIT] Round 2 Interview",
  };
};

const round1Interview = (name, meetlink) => {
  return {
    body: `Hey ${name}, <br>
    Your IEEE Round 1 Interview is about to start.
    Please join this link: ${meetlink}.
    `,
    subject: "[IEEE-VIT] Round 1 Interview",
  };
};

module.exports = { round1Interview, round2Interview, forgotPasswordTempalate };

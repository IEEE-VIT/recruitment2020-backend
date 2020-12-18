const admin = require("firebase-admin");
const logger = require("../configs/winston");

const verifiedUser = async (email) => {
  const result = await admin
    .auth()
    .getUserByEmail(email)
    .then((userRecord) => {
      if (userRecord.emailVerified) {
        return true;
      }
      return false;
    })
    .catch((err) => {
      logger.error(`Failure to verifyEmail due to ${err}`);
      return false;
    });
  return result;
};

module.exports = { verifiedUser };

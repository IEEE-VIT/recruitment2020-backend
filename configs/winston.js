/* eslint-disable new-cap */
const { createLogger, format, transports } = require("winston");

const {
  combine,
  timestamp,
  prettyPrint,
  json,
  colorize,
  align,
  printf,
} = format;

const myformat = combine(
  colorize(),
  timestamp(),
  align(),
  printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const logger = new createLogger({
  transports: [
    new transports.File({
      level: "info",
      filename: "./logs/server.logs",
      handleExceptions: true,
      format: combine(json(), timestamp(), prettyPrint()),
    }),
    new transports.File({
      filename: "./logs/error.logs",
      level: "error",
    }),
    new transports.Console({
      level: "info",
      handleExceptions: true,
      format: myformat,
    }),
  ],
  exitOnError: false,
});

logger.stream = {
  write(message) {
    logger.info(message);
  },
};
module.exports = logger;

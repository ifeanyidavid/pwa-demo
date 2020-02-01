const winston = require("winston");
const { combine, timestamp, printf } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

const consoleTransport = new winston.transports.Console({
  format: combine(
    timestamp(),
    customFormat
  )
});

const myWinstonOptions = {
  transports: [consoleTransport]
};
const logger = winston.createLogger(myWinstonOptions);

module.exports = logger;

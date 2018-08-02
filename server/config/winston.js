import winston from "winston";
import path from "path";

console.log(__dirname);
const pathFile = path.join(__dirname, "..", "logs/api.log");

var options = {
  file: {
    level: "info",
    filename: pathFile,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    colorize: false
  }
};

var logger = winston.createLogger({
  transports: [new winston.transports.File(options.file)],
  exitOnError: false // do not exit on handled exceptions
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;

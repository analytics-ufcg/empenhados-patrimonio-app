var appRoot = require("app-root-path");
var winston = require("winston");

var options = {
  file: {
    level: "info",
    filename: `${appRoot}/server/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
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

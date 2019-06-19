const winston = require("winston");
const config = require("config");
require("winston-mongodb");
require("express-async-errors");

const database = config.get("db");

const dbStackFormat = winston.format(error => {
  const obj = {
    message: error.message.split("\n")[0],

    type: error.error.type || "Uncaught Exeption", //If this error was a promise then error.error.type is set by my custom process.on("unhandledRejection") call.
    stackTrace: error.error.stack,
    traceArray: error.trace
  };

  return obj;
});

const options = {
  file: {
    level: "warn",
    filename: "logfile.log",
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    handleExceptions: true,
    format: winston.format.simple()
  },
  mongoDB: {
    level: "error",
    db: database,
    handleExceptions: true,
    format: winston.format.combine(dbStackFormat(), winston.format.metadata())
  }
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(options.console),
    new winston.transports.File(options.file),
    new winston.transports.MongoDB(options.mongoDB)
  ]
});

function init() {
  process.on("unhandledRejection", ex => {
    ex.type = "Unhandled Rejection";
    throw ex;
  });
  /* 

    if (process.env.NODE_ENV !== "production") {
      winston.add(
        new winston.transports.Console({
          format: winston.format.simple()
        })
      );
    } */
}

logger.init = init;
module.exports = logger;

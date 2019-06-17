const winston = require("winston");
const config = require("config");
require("winston-mongodb");
require("express-async-errors");

const database = config.get("db");

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
    format: winston.format.simple()
  },
  mongoDB: {
    level: "error",
    db: database
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
  process.on("uncaughtException", ex => {
    logger.error("FATAL: Uncaught exeption: ", ex);
    process.exit(1);
  });

  process.on("unhandledRejection", ex => {
    logger.error("FATAL: Unhandled Rejection: ", ex);
    process.exit(1);
  });
  /* 
    winston.add(
      new winston.transports.File({ filename: "logfile.log", level: 1 })
    );
    winston.add(
      new winston.transports.MongoDB({
        db: "mongodb://localhost/vidly_dev",
        level: 0
      })
    );
  
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

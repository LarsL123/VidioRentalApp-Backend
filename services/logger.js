const winston = require("winston");
const config = require("config");
require("winston-mongodb");
require("express-async-errors");

const database = config.get("db");

const errorStackFormat = winston.format(error => {
  const obj = Object.assign({}, error, {
    message: error.message.split("\n")[0],
    details: {
      type: "Error", //Exception vs promise rejection
      stackTrace: error.trace,
      trace: error.trace
    }
  });
  console.log(obj); //See winstin documentation...

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
    format: winston.format.simple()
  },
  mongoDB: {
    level: "error",
    db: database,
    handleExceptions: true,
    format: errorStackFormat()
    /*  format: winston.format.combine(
      errorStackFormat(),
      winston.format.metadata()
    ) */
  }
};

const logger = winston.createLogger({
  //format: winston.format.combine(errorStackFormat(), winston.format.simple()),
  transports: [
    new winston.transports.Console(options.console),
    new winston.transports.File(options.file),
    new winston.transports.MongoDB(options.mongoDB)
  ]
});

function init() {
  /*  process.on("uncaughtException", ex => {
     logger.error("Uncaught exeption: " + ex.message, {
      stackTrace: ex.stack
    }); 

    logger.error("An error occured");
    //process.exit(1);
  }); */

  process.on("unhandledRejection", ex => {
    logger.error("Unhandled Rejection: ", { stackTrace: "ex.stack" }, () => {
      process.exit(1);
    });
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

/* const errorStackFormat = winston.format(info => {
  console.log(info);
  if (info instanceof Error) {
    return Object.assign({}, info, {
      stack: info.stack,
      message: info.message
    });
  }
  return info;
}); */

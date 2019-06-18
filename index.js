const express = require("express");
const app = express();
const logger = require("./services/logger");

logger.init();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/production")(app);

//logger.error(new Error("Error fack")); // https://stackoverflow.com/questions/47231677/how-to-log-full-stack-trace-with-winston-3
//const error = new Error("Thgis is not good");
//logger.error(error.message, { meta: error.stack });
//logger.error("msg", { stackTrace: new Error("Error").stack });
throw new Error("This is a new error");

/* 
--Interface
logger.error("This is an error"); // => "message": "This is an error"  BE AWARE: No stackTrace
logger.error(new Error("This is a crictical error")); // => "message: "This is a crictical error" , "stacktrace": "Stack...." 
*/

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

module.exports = server;

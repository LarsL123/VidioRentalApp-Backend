const express = require("express");
const app = express();
const logger = require("./services/logger");

logger.init();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/production")(app);

logger.error(new Error("Error fack")); // https://stackoverflow.com/questions/47231677/how-to-log-full-stack-trace-with-winston-3

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

module.exports = server;

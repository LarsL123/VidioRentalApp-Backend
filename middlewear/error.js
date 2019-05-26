const winston = require("winston");

module.exports = function(err, req, res, next) {
  winston.error("Something failed in express: ", err);
  res.status(500).send("Something failed");
};

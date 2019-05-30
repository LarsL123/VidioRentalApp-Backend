const winston = require("winston");

//Middlewear that catches all errors in the requst processing pipline
module.exports = function(err, req, res, next) {
  winston.error("Something failed in express: ", err);
  res.status(500).send("Something failed");
};

//Logging levels:

/*  

error - 1
warn - 2
info - 3
verbose - 4
debug - 5
silly - 6

*/

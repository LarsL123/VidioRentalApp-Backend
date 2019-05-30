const mongoose = require("mongoose");
const logger = require("../services/logger");

module.exports = function() {
  mongoose
    .connect("mongodb://localhost/vidly_dev", {
      useCreateIndex: true,
      useNewUrlParser: true
    })
    .then(() => logger.info("Connected to MongoDB..."));
};

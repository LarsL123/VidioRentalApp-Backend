const express = require("express");
const app = express();
const logger = require("./services/logger");
const cors = require("cors"); // --> https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b

logger.init();
app.use(cors());
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

require("./startup/production")(app);

const port = process.env.PORT || 3900;
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

module.exports = server;

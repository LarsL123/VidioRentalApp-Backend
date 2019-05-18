const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");

const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/vidly_dev")
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err =>
    console.log("Was not able to connect to MongoDB. Error: ", err)
  );

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

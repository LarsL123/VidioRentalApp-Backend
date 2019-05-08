const Joi = require("Joi");
const helmet = require("helmet");
const express = require("express");
const logger = require("./logger");
const auth = require("./authenticating");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use(logger);
app.use(auth);

const genres = [
  { id: 1, name: "Romance" },
  { id: 2, name: "Action" },
  { id: 3, name: "Comedy" },
  { id: 4, name: "Thriller" }
];

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id === parseInt(req.params.id));
  if (!genre) {
    return res.status(400).send("Was not able to find genre.");
  }

  res.send(genre);
});

app.post("/api/genres", (req, res) => {
  const { error } = validateGenre(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const genre = { id: genres.length + 1, name: req.body.name };
  genres.push(genre);
  res.send(genre);
});

app.put("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id === req.param.id);
  if (!genre) {
    return res.status(400).send("There are no genres with id" + req.param.id);
  }
  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  genre.name = req.body.name;
  res.send(genre);
});

app.delete("/api/genres/:id", (req, res) => {
  const genre = genres.find(g => g.id === req.param.id);
  if (!genre) {
    return res.status(400).send("There are no genres with id" + req.param.id);
  }

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
  };

  return Joi.validate(genre, schema);
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}....`));

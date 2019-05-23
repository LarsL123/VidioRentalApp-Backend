const express = require("express");
const router = express.Router();
const { Genre } = require("../models/genre");
const { Movie, validate } = require("../models/movie");
const auth = require("../middlewear/auth");

router.get("/", async (req, res) => {
  const genres = await Movie.find().sort("title");
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genreId");

  const movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name
    }
  });

  try {
    await movie.save();
    res.send(movie);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    res.status(400).send("Was not not able to add genre to database");
  }
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      genre: req.body.genre
    },
    { new: true }
  );
  if (!movie)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(movie);
});

router.delete("/:id", auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(movie);
});

module.exports = router;

// mongoose
//   .connect("mongodb://localhost/vidly_dev")
//   .then(() => "Connected")
//   .catch(err => console.log("Eroro in connection yo mongo db" + err));

// async function addMovie(title, numberInStock, dailyRentalRate, genre) {
//   const movie = new Movie({
//     title: title,
//     numberInStock: numberInStock,
//     dailyRentalRate: dailyRentalRate,
//     genre: genre
//   });
//   try {
//     const result = await movie.save();
//     console.log(result);
//   } catch (ex) {
//     console.log(ex);
//   }
//   movie.save();
// }

// addMovie(new Genre({ name: "Lars Lien" }));

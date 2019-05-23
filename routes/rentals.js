const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Movie } = require("../models/movie");
const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const Fawn = require("fawn");
const auth = require("../middlewear/auth");

Fawn.init(mongoose);

router.get("/me", async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid MovieId");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid CustomerId");

  if (movie.numberInStock === 0)
    return res.status(400).send("Move is not in stock");

  let rental = new Rental({
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold
    }
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    res.send(rental);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
    res
      .status(500)
      .send(
        "Was not not able to add rental to database, Something failed on the server"
      );
  }
});

module.exports = router;

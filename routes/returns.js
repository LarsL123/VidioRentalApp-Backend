const express = require("express");
const router = express.Router();
const auth = require("../middlewear/auth");
const { Rental, validate } = require("../models/rental");

const { Movie } = require("../models/movie");
const validate1 = require("../middlewear/validate");

router.post("/", [auth, validate1(validate)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental not found.");
  if (rental.dateReturned)
    return res.status(400).send("Rental allredy processed");

  rental.return();
  await rental.save();

  await Movie.update({ _id: rental.movie._id }, { $inc: { numberInStock: 1 } });

  return res.send(rental);
});

module.exports = router;

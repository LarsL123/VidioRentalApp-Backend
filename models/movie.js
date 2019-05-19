const mongoose = require("mongoose");
const Joi = require("Joi");
const { Genre } = require("./genre");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    numberInStock: Number,
    dailyRentalRate: Number,
    genre: {
      type: Genre.schema,
      required: true
    }
  })
);

function validateMovie(genre) {
  const schema = {
    title: Joi.string()
      .min(3)
      .max(50)
      .required(),
    numberInStock: Joi.number()
      .min(0)
      .max(255)
      .required(),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(100)
      .required(),
    genreId: Joi.string().required()
  };

  return Joi.validate(genre, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;

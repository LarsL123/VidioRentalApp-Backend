const mongoose = require("mongoose");
const Joi = require("Joi");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: { type: String, required: true, minlength: 3, maxlength: 50 },
        isGold: { type: Boolean, required: true }
      })
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 50
        },
        dailyRentalRate: { type: Number, min: 0, max: 255, required: true }
      }),
      required: true
    },

    dayOut: { type: Date, default: Date.now },
    dayIn: { type: Date },
    rentalFee: { type: Number, min: 0 }
  })
);

function validateRental(genre) {
  const schema = {
    movieId: Joi.string().required(),
    customerId: Joi.string().required()
  };

  return Joi.validate(genre, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;

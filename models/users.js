const mongoose = require("mongoose");
const Joi = require("Joi");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50
    },
    email: {
      type: String,
      unique: true,
      required: true,
      min: 5,
      max: 255
    },
    password: {
      type: String,
      required: true,
      min: 5,
      max: 1024
    }
  })
);

function validateUser(user) {
  const schema = {
    username: Joi.string()
      .min(3)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;

const mongoose = require("mongoose");
const Joi = require("Joi");

const Customer = mongoose.model(
  "Customers",
  new mongoose.Schema({
    isGold: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30
    },
    phone: {
      type: String,
      required: true
    }
  })
);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
      .max(30),
    isGold: Joi.boolean(),
    phone: Joi.string().required()
  };
  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;

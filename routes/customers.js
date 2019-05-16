const express = require("express");
const router = express.Router();
const Joi = require("Joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  new mongoose.Schema("Customer", {
    isGold: {
      type: Boolean,
      required: true
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxLength: 30
    },
    phone: {
      type: String,
      required: true
    }
  })
);

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res.status(404).send("No customer with the given ID was not found");

  res.send(customer);
});

router.post("/", async (req, res) => {
  const error = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer(req.body);
  try {
    customer = await customer.save();
    res.send(customer);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }
});

/* router.put("/:id", async (req, res) => {
  const error = validateCustomer(req.body);
}); */

function validateCustomer(customer) {
  const schema = {
    name: Joi.String()
      .required()
      .min(3)
      .max(30),
    isGold: Joi.boolean().required(),
    phone: Joi.String().required()
  };
  return Joi.validate(customer);
}

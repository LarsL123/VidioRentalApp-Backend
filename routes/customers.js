const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { validate, Customer } = require("../models/customer");

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
  const { error } = validate(req.body);

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

router.put("/:id", async (req, res) => {
  const { body, params } = req;

  const { error } = validate(body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const result = await Customer.findByIdAndUpdate(
      params.id,
      {
        $set: {
          name: body.name,
          isGold: body.isGold,
          phone: body.phone
        }
      },
      { new: true }
    );
    res.send(result);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    return res
      .status(404)
      .send("The customer with the id: " + id + " was not found");
  }
  res.send(customer);
});

module.exports = router;

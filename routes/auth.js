const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(400).send("Invalid email or password");

  const token = User.generateAuthToken();

  res.send(token);
});

function validate(user) {
  const schema = {
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

module.exports = router;

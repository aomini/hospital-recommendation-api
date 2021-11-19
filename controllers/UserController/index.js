const express = require("express");
const { User } = require("../../models");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const findAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      message: "success",
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      message: "fail",
      data: err,
    });
  }
};

const schema = Joi.object({
  first_name: Joi.string().min(5).required(),
  // email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required(),
  username: Joi.string().min(5).required(),
});

const createUser = async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userData = {
    first_name: req.body.first_name,
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
  };
  try {
    const saveUser = await userdata.create(userData);
    res.send("Registration Successful");
  } catch (err) {
    console.log("Error");
    res.json(err);
  }
};

const findUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "success",
    data: user,
  });
};

const userLogin = async (req, res) => {
  // const user = await User.findOne({ where: { username: req.body.username } });
  const user = await User.findOne(
    { where: { username: req.body.username } } || {
      where: { email: req.body.email },
    }
  );
  if (!user) return res.status(400).send("Invalid Email or Username");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Password");

  const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.send(token);
};

module.exports = {
  findAll,
  createUser,
  findUser,
  userLogin,
};

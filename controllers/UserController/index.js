const express = require("express");
const { User } = require("../../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.findAll = async (req, res, next) => {
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

module.exports.createUser = async (req, res, next) => {
  const userData = {
    first_name: req.body.first_name,
    password: req.body.password,
    username: req.body.username,
  };
  try {
    await User.create(userData);
    res.send("Registration Successful");
  } catch (err) {
    console.log("Error");
    res.json(err);
  }
};

module.exports.findUser = async (req, res, next) => {
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

module.exports.userLogin = async (req, res, next) => {
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
    expiresIn: "1y",
  });

  res.header("auth-token", token).json({
    message: "Logged in successfully",
    data: token,
  });
  next();
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.update(req.body);
    res.status(200).json({
      message: "User Updated Successfully",
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(err.code || 400).json({
      data: err,
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.status(200).json({
      message: "User Deleted Successfully",
      success: true,
    });
  } catch (err) {
    res.status(err.code || 400).json({
      data: err,
    });
  }
};

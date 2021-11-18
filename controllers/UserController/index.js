const express = require("express");
const {User} = require('../../models')
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi")
require("dotenv").config();


const findAll = async (req, res) => {
  try{
    const users = await User.findAll();
    res.status(200).json({
      message: 'success',
      data: users
    })
  }
  catch(err){
    res.status(400).json({
      message: 'fail',
      data: err
    })
  }
 
};

const schema = Joi.object({
  first_name: Joi.string().min(5).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(8).required(),
  username: Joi.string().min(5).required(),
});

const createUser = async (req, res) => {
  const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    // generating password hash
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);
  
    // creating user
    const userdata = new User({
      first_name: req.body.first_name,
      email: req.body.email,
      password: hashedpassword,
      username: req.body.username,
    });
    try {
      const saveUser = await userdata.save();
      res.send("Registration Successful");
      console.log("Success")
    } catch (err) {
      res.json(err);
      console.log("Error")
    }
};


const findUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    message: 'success',
    data: user,
  });
};


module.exports = {
  findAll,
  createUser,
  findUser,
};



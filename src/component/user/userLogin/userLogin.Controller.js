const mongoose = require("mongoose");
const express = require("express");
const userLogin = require("./userLogin.model");
const bcrypt = require("bcryptjs");
const userLogins = {};

userLogins.createUser = async (req, res) => {
  const email = req.body.email.toLowerCase();
  console.log("req.body", req.body);
  if (!req.body.email) {
    res.send({
      success: false,
      msg: "Email is required",
    });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const getEmail = await userLogin.find({ email: email });
    if (getEmail.length > 0) {
      return res.status(200).send({
        success: true,
        msg: "Email Already Exists",
      });
    } else {
      const createUser = new userLogin({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        userType: "user",
      });
      const data = await createUser.save();
      return res.status(201).send({
        success: true,
        msg: "Data Created Successfully",
        data: data,
      });
    }
  } catch (error) {
    return res.status(400).send({
      success: false,
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

userLogins.forgotPass = async (req, res) => {};

userLogins.varifyOTP = async (req, res) => {};

userLogins.resetPass = async (req, res) => {};

userLogins.changePass = async (req, res) => {};

module.exports = userLogins;

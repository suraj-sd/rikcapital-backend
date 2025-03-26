const express = require("express");
const router = express.Router();

const userLogin = require("./userLogin.Controller");

router.post("/createUser", (req, res) => {
  userLogin.createUser(req, res);
});

router.get("/loginUser", (req, res) => {
  userLogin.loginUser(req, res);
});

router.post("/forgotPass", (req, res) => {
  userLogin.forgotPass(req, res);
});

router.post("/varifyOTP", (req, res) => {
  userLogin.varifyOTP(req, res);
});

router.post("/resetPass", (req, res) => {
  userLogin.resetPass(req, res);
});

router.post("/changePass", (req, res) => {
  userLogin.changePass(req, res);
});
module.exports = router;

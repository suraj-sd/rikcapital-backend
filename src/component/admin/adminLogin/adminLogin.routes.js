const express = require("express");
const router = express.Router();

const adminLogin = require("./adminLogin.Controller");

router.post("/createAdmin", (req, res) => {
  adminLogin.createAdmin(req, res);
});

router.post("/loginAdminAndUser", (req, res) => {
  adminLogin.loginAdminAndUser(req, res);
});

router.post("/forgotPass", (req, res) => {
  adminLogin.forgotPass(req, res);
});

router.post("/varifyOTP", (req, res) => {
  adminLogin.varifyOTP(req, res);
});

router.post("/resetPass", (req, res) => {
  adminLogin.resetPass(req, res);
});

router.post("/changePass", (req, res) => {
  adminLogin.changePass(req, res);
});
module.exports = router;

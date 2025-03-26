const express = require("express");
const router = express.Router();

const role = require("./role.Controller");

router.post("/createRoles", (req, res) => {
  role.createRoles(req, res);
});

router.get("/getAll", (req, res) => {
  role.getAll(req, res);
});

router.put("/update", (req, res) => {
  role.update(req, res);
});

module.exports = router;

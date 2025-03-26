const mongoose = require("mongoose");
const userLoginSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    password: {
      type: String,
    },
    userType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const userLogin = mongoose.model("user", userLoginSchema);

module.exports = userLogin;

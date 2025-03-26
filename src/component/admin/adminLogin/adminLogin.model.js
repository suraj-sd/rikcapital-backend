const mongoose = require("mongoose");
const adminLoginSchema = new mongoose.Schema(
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
    forgetPasswordInfo: {
      token: String,
      validTokenTime: String,
      validLink: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

const adminLogin = mongoose.model("admin", adminLoginSchema);

module.exports = adminLogin;

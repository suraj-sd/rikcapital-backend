const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminLogin = require("./adminLogin.model");
const userLogin = require("../../user/userLogin/userLogin.model");
const util = require("../../../utils/config");

const adminLogins = {};

adminLogins.createAdmin = async (req, res) => {
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
    const getEmail = await adminLogin.find({ email: email });
    if (getEmail.length > 0) {
      return res.status(200).send({
        success: true,
        msg: "Email Already Exists",
      });
    } else {
      const createAdmin = new adminLogin({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        userType: "admin",
      });
      const data = await createAdmin.save();
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

// adminLogins.loginAdminAndUser = async (req, res) => {
//   console.log("req.body:", req.body);

//   // Extract and decode the authorization header
//   const encData = req.headers["authorization"];
//   if (!encData) {
//     return res
//       .status(400)
//       .send({ success: false, msg: "Authorization header missing" });
//   }

//   // Decode the Base64 encoded authorization header
//   const decData = Buffer.from(encData, "base64").toString("utf-8");
//   console.log("decData:", decData);

//   // Split the decoded data into email and password
//   const [email, password] = decData.split(":");
//   if (!email || !password) {
//     return res
//       .status(400)
//       .send({ success: false, msg: "Invalid authorization format" });
//   }

//   console.log("email:", email);
//   console.log("password:", password);

//   // Prepare the condition for querying the database
//   const condition = { email: email.toLowerCase() };

//   try {
//     // First, find if the user exists in either `adminLogin` or `userLogin`
//     const admin = await adminLogin.findOne(condition, {
//       name: 1,
//       email: 1,
//       userType: 1,
//       password: 1,
//     });
//     const user = await userLogin.findOne(condition, {
//       name: 1,
//       email: 1,
//       empDetail: 1,
//       userType: 1,
//       password: 1,
//       isActive: 1,
//     });

//     let account = admin || user; // If found in adminLogin, use admin; otherwise, use user
//     console.log("account", account);
//     if (!account) {
//       return res.status(404).send({ success: false, msg: "User not found" });
//     }

//     // Extract userType
//     const userType = account.userType;

//     // Compare the provided password with the hashed password in the database
//     const isPasswordValid = bcrypt.compareSync(password, account.password);
//     if (!isPasswordValid) {
//       return res.status(400).send({ success: false, msg: "Invalid password" });
//     }

//     // Handle Admin Login
//     if (userType === "admin") {
//       const userObject = {
//         _id: account._id,
//         name: account.name,
//         email: account.email,
//         userType: account.userType,
//         adminlogin: true,
//       };

//       console.log("userObject:", userObject);

//       // Generate JWT token and refresh token
//       const token = jwt.sign(
//         { userObject, exp: Math.floor(Date.now() / 1000) + 10 * 60 }, // 10 minutes expiry
//         util.admin_token.TOKEN_SECRET
//       );
//       const refreshToken = jwt.sign(
//         { userObject, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, // 1 hour expiry
//         util.admin_token.TOKEN_SECRET
//       );

//       return res.send({ success: true, token, refreshToken });
//     }

//     // // Handle Regular User Login
//     // if (!account.isActive) {
//     //   return res
//     //     .status(400)
//     //     .send({ success: false, msg: "User is not active" });
//     // }

//     // Fetch role data for the user
//     const roleData = await role.findOne(
//       { role: account.empDetail.role },
//       { accessControl: 1 }
//     );
//     if (!roleData) {
//       return res
//         .status(404)
//         .send({ success: false, msg: "Role data not found" });
//     }

//     // Create a user object for the token payload
//     const userObject = {
//       _id: account._id,
//       name: account.name,
//       roleCode: account.empDetail.roleCode,
//       email: account.email,
//       userType: account.userType,
//       access: roleData.accessControl,
//       adminlogin: false,
//     };

//     console.log("userObject:", userObject);

//     // Generate JWT token and refresh token
//     const token = jwt.sign(
//       { userObject, exp: Math.floor(Date.now() / 1000) + 10 * 60 }, // 10 minutes expiry
//       util.admin_token.TOKEN_SECRET
//     );
//     const refreshToken = jwt.sign(
//       { userObject, exp: Math.floor(Date.now() / 1000) + 60 * 60 }, // 1 hour expiry
//       util.admin_token.TOKEN_SECRET
//     );

//     return res.send({ success: true, token, refreshToken });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).send({
//       success: false,
//       msg: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };

adminLogins.loginAdminAndUser = async (req, res) => {
  console.log("req.body:", req.body);

  // Extract the authorization header
  const encData = req.headers["authorization"];
  if (!encData || !encData.startsWith("Basic ")) {
    return res
      .status(400)
      .send({ success: false, msg: "Invalid authorization format" });
  }

  // Remove "Basic " prefix and decode
  const base64Credentials = encData.split(" ")[1]; // ✅ Extracts correct Base64 part
  const decData = Buffer.from(base64Credentials, "base64").toString("utf-8");

  // Ensure email & password are extracted correctly
  const [email, password] = decData.split(":");
  if (!email || !password) {
    return res
      .status(400)
      .send({ success: false, msg: "Invalid authorization format" });
  }

  console.log("email:", email);
  console.log("password:", password);

  try {
    const condition = { email: email.toLowerCase() };
    const admin = await adminLogin.findOne(condition, {
      name: 1,
      email: 1,
      userType: 1,
      password: 1,
    });
    const user = await userLogin.findOne(condition, {
      name: 1,
      email: 1,
      empDetail: 1,
      userType: 1,
      password: 1,
      isActive: 1,
    });

    let account = admin || user;
    console.log("account", account);
    if (!account) {
      return res.status(404).send({ success: false, msg: "User not found" });
    }

    const userType = account.userType;
    const isPasswordValid = bcrypt.compareSync(password, account.password);
    if (!isPasswordValid) {
      return res.status(400).send({ success: false, msg: "Invalid password" });
    }

    if (userType === "admin") {
      const userObject = {
        _id: account._id,
        name: account.name,
        email: account.email,
        userType: account.userType,
        adminlogin: true,
      };

      console.log("userObject:", userObject);

      const token = jwt.sign(
        { userObject, exp: Math.floor(Date.now() / 1000) + 10 * 60 },
        util.admin_token.TOKEN_SECRET
      );
      const refreshToken = jwt.sign(
        { userObject, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
        util.admin_token.TOKEN_SECRET
      );

      return res.send({ success: true, token, refreshToken });
    }

    const roleData = await role.findOne(
      { role: account.empDetail.role },
      { accessControl: 1 }
    );
    if (!roleData) {
      return res
        .status(404)
        .send({ success: false, msg: "Role data not found" });
    }

    const userObject = {
      _id: account._id,
      name: account.name,
      roleCode: account.empDetail.roleCode,
      email: account.email,
      userType: account.userType,
      access: roleData.accessControl,
      adminlogin: false,
    };

    console.log("userObject:", userObject);

    const token = jwt.sign(
      { userObject, exp: Math.floor(Date.now() / 1000) + 10 * 60 },
      util.admin_token.TOKEN_SECRET
    );
    const refreshToken = jwt.sign(
      { userObject, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      util.admin_token.TOKEN_SECRET
    );

    return res.send({ success: true, token, refreshToken });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      success: false,
      msg: "Internal Server Error",
      error: error.message,
    });
  }
};

adminLogins.forgotPass = async (req, res) => {};

adminLogins.varifyOTP = async (req, res) => {};

adminLogins.resetPass = async (req, res) => {};

adminLogins.changePass = async (req, res) => {};

module.exports = adminLogins;

const express = require("express");

const adminLogin = require("../component/admin/adminLogin/adminLogin.routes");
const uploadReport = require("../component/admin/uploadReport/uploadReport.routes");

const userLogin = require("../component/user/userLogin/userLogin.routes");
// const showUploadReport = require("../component/user/showUploadReport/showUploadReport.routes");
const bulkDataUpload = require("../component/admin/bulkDataUpload/bulkDataUpload.routes");
const role = require("../component/role/role.routes");

let version = "/api/v1";

module.exports = (app) => {
  app.use(version + "/admin", adminLogin);
  app.use(version + "/ur", uploadReport);

  app.use(version + "/user", userLogin);
  //   app.use(version + "/sur", showUploadReport);
  app.use(version + "/bdu", bulkDataUpload);
  app.use(version + "/role", role);
};

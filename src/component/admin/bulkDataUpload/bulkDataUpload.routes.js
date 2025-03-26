const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const bulkDataUpload = require("./bulkDataUpload.Controller"); // Fix import
// const a = require('')
const filePath = path.join(__dirname, "../../../../uploads/excelData");

// Configure Multer
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("filePath", filePath);
      cb(null, filePath);
    },
    filename: function (req, file, cb) {
      const uniqueName = "file" + Date.now() + path.extname(file.originalname);
      cb(null, uniqueName);
    },
  }),
});

router.post("/bulkAdded", upload.single("csvFile"), bulkDataUpload.bulkAdded);

router.get("/bulkget", bulkDataUpload.bulkget);

module.exports = router;

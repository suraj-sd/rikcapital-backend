const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const uploadReport = require("./uploadReport.Controller"); // Fix import
// const a = require('')
// Function to determine the current quarter folder dynamically
const getQuarterFolder = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "quarter1";
  if (month >= 6 && month <= 8) return "quarter2";
  if (month >= 9 && month <= 11) return "quarter3";
  return "quarter4"; // December to February
};

// Configure Multer with dynamic folder creation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const quarterFolder = getQuarterFolder();
    const uploadPath = path.join(
      __dirname,
      `../../../../uploads/reports/${quarterFolder}`
    );

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });

    console.log("Saving file to:", uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `file_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post(
  "/addReport",
  upload.fields([
    { name: "report1" },
    { name: "report2" },
    { name: "report3" },
    { name: "report4" },
    { name: "report5" },
    { name: "report6" },
  ]),
  (req, res) => {
    uploadReport.addReport(req, res);
  }
);

router.get("/getStockReport/:BSE_code", (req, res) => {
  uploadReport.getStockReport(req, res);
});

router.put(
  "/updateReport/:_id",
  upload.fields([
    { name: "report1" },
    { name: "report2" },
    { name: "report3" },
    { name: "report4" },
    { name: "report5" },
    { name: "report6" },
  ]),
  (req, res) => {
    uploadReport.updateReport(req, res);
  }
);

module.exports = router;

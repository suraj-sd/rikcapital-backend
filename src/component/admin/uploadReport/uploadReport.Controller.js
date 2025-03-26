const mongoose = require("mongoose");
const fs = require("fs");
const uploadReport = {};
const uploadReportSchema = require("./uploadReport.model");
const bulkDataUploadSchemaa = require("../bulkDataUpload/bulkDataUpload.model");

// Function to get the current quarter
const getQuarterFolder = () => {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "quarter1";
  if (month >= 6 && month <= 8) return "quarter2";
  if (month >= 9 && month <= 11) return "quarter3";
  return "quarter4";
};

// Add Report
uploadReport.addReport = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    const quarter = getQuarterFolder();
    let reports = [];

    // Extract filenames from req.files
    if (req.files) {
      reports = [
        "report1",
        "report2",
        "report3",
        "report4",
        "report5",
        "report6",
      ]
        .map((report) => req.files[report]?.[0]?.filename)
        .filter(Boolean);
    }

    console.log("Reports to be saved:", reports);

    if (reports.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const addData = new uploadReportSchemaa({
      BSE_code: req.body.BSE_code,
      name: req.body.name,
      [quarter]: reports,
    });

    console.log("Saved Data:", addData);
    const data = await addData.save();

    return res.status(200).json({
      success: true,
      message: "Data added successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data addition unsuccessful",
      error: error.message,
    });
  }
};

// Get Report
uploadReport.getStockReport = async (req, res) => {
  try {
    // Extract BSE_code from req.params
    const { BSE_code } = req.params;

    // Ensure BSE_code is valid
    if (!BSE_code) {
      return res.status(400).json({ message: "BSE_code is required" });
    }

    // Find stock data
    const stockData = await bulkDataUploadSchemaa.findOne({
      BSE_code: BSE_code, // Ensure BSE_code is a string
    });

    if (!stockData) {
      return res.status(404).json({ message: "Stock data not found" });
    }

    // Find report data
    const reportData = await uploadReportSchema.findOne({
      BSE_code: BSE_code, // Ensure BSE_code is a string
    });

    res.json({
      stockData,
      reportData: reportData || null, // Return null if no report data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Report
uploadReport.updateReport = async (req, res) => {
  try {
    const { _id } = req.params;
    const quarter = getQuarterFolder();

    // Extract uploaded files
    const reports = [
      "report1",
      "report2",
      "report3",
      "report4",
      "report5",
      "report6",
    ]
      .map((report) =>
        req.files[report] ? req.files[report][0].filename : null
      )
      .filter(Boolean);

    const updatedData = await uploadReportSchemaa.findByIdAndUpdate(
      _id,
      { $set: { [quarter]: reports } },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data updated successfully",
      data: updatedData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Data update unsuccessful",
      error: error.message,
    });
  }
};

module.exports = uploadReport;

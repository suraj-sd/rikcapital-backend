const mongoose = require("mongoose");
const csvParser = require("csv-parser");
const fs = require("fs");

const bulkDataUpload = {};
const bulkDataUploadSchemaa = require("./bulkDataUpload.model");

bulkDataUpload.bulkAdded = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      msg: "CSV file not uploaded",
    });
  }

  const filePath = req.file.path;

  try {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", async () => {
        console.log("CSV data:", data);

        await bulkDataUploadSchemaa.insertMany(data);

        res.status(200).json({
          success: true,
          msg: "CSV data successfully uploaded and saved",
          data: data,
        });
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        res.status(500).json({
          success: false,
          msg: "Error reading CSV file",
          error: error.message,
        });
      });
  } catch (err) {
    console.error("Error processing the file:", err);
    res.status(500).json({
      success: false,
      msg: "Server error while processing the file",
      error: err.message,
    });
  }
};

// bulkDataUpload.bulkget = async (req, res) => {
//   console.log("get data", req.query);
//   let page = parseInt(req.query.page) || 1;
//   let limit = parseInt(req.query.limit) || 10;
//   let skip = (page - 1) * limit;
//   let query = {};

//   if (req.query.Name) {
//     query.Name = { $regex: req.query.Name, $options: "i" };
//   }
//   if (req.query.BSE_code) {
//     query.BSE_code = { $regex: req.query.BSE_code, $options: "i" };
//   }
//   if (req.query.NSE_code) {
//     query.NSE_code = { $regex: req.query.NSE_code, $options: "i" };
//   }
//   try {
//     const getData = await bulkDataUploadSchemaa
//       .find(query)
//       .skip(skip)
//       .limit(limit);
//     if (getData.length > 0) {
//       res.status(200).send({
//         success: true,
//         msg: "Data Found Successfully",
//         data: getData,
//       });
//     } else {
//       res.status(400).send({
//         success: false,
//         msg: "Data Found UnSuccessfully",
//       });
//     }
//   } catch (error) {
//     res.status(400).send({
//       success: false,
//       msg: "Data Found UnSuccessfully",
//       error: error.message,
//     });
//   }
// };

bulkDataUpload.bulkget = async (req, res) => {
  console.log("get data", req.query);
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  let skip = (page - 1) * limit;
  let query = {};

  if (req.query.Name) {
    query.Name = { $regex: req.query.Name, $options: "i" };
  }
  if (req.query.BSE_code) {
    query.BSE_code = { $regex: req.query.BSE_code, $options: "i" };
  }
  if (req.query.NSE_code) {
    query.NSE_code = { $regex: req.query.NSE_code, $options: "i" };
  }

  try {
    const totalCount = await bulkDataUploadSchemaa.countDocuments(query);
    const getData = await bulkDataUploadSchemaa
      .find(query)
      .skip(skip)
      .limit(limit);

    if (getData.length > 0) {
      res.status(200).send({
        success: true,
        msg: "Data Found Successfully",
        data: getData,
        totalCount: totalCount, // Send total count for pagination
      });
    } else {
      res.status(400).send({
        success: false,
        msg: "No Data Found",
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      msg: "Error retrieving data",
      error: error.message,
    });
  }
};

module.exports = bulkDataUpload;

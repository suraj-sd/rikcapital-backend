const mongoose = require("mongoose");

const bulkDataUploadSchemaa = new mongoose.Schema(
  {
    Name: {
      type: String,
    },
    BSE_code: {
      type: String,
    },
    NSE_code: {
      type: String,
    },
    Industry: {
      type: String,
    },
    Current_Price: {
      type: String,
    },
    Market_Capitalization: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("stockMarketData", bulkDataUploadSchemaa);

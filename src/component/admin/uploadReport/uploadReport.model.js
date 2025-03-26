const mongoose = require("mongoose");

const uploadReportSchema = new mongoose.Schema(
  {
    BSE_code: { type: String, required: true },
    name: { type: String, required: true },
    quarter1: [{ type: String }], // Store filenames as arrays
    quarter2: [{ type: String }],
    quarter3: [{ type: String }],
    quarter4: [{ type: String }],
  },
  {
    timestamps: true,
  },
  { strict: false }
); // Allow dynamic fields

module.exports = mongoose.model("report", uploadReportSchema);

const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema(
  {
    roleCode: { type: String },
    roleName: { type: String },
    isActive: { type: Boolean, default: true },
    accessControl: [
      {
        name: { type: String },
        properties: [
          {
            name: { type: String },
            value: { type: Number },
            access: { type: Array, _id: false },
            _id: false,
          },
        ],
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const role = mongoose.model("role", roleSchema);

module.exports = role;

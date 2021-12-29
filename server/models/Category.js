const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true } // will create automatically createdAt and updatedAt keys.
);

module.exports = mongoose.model("Category", CategorySchema);

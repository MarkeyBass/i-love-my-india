const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      // index: true,
    },
    desc: {
      type: String,
      required: true,
      // default: "",
    },
    photo: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      required: true,
    },
    categories: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true } // will create automatically created at and updated at.
  // { strict: true }
);

module.exports = mongoose.model("Post", PostSchema);

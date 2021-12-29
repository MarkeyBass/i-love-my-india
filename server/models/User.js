const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // will create automatically created at and updated at.
);

module.exports = mongoose.model("User", UserSchema);

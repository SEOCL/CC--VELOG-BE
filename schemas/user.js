const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  userNo: {
    type: Number,
    required: true,
    unique: true,
  }
});

module.exports = mongoose.model("User", userSchema);
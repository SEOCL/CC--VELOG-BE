const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique : true
  },
  password: {
    type: String,
    
  },
  userName: {
    type: String,
    unique : true
  },
  userNo: {
    type: Number,
    
    unique: true,
  },
  provider:{
    type: String
  }
});

module.exports = mongoose.model("User", userSchema);
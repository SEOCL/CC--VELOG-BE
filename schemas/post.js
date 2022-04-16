const mongoose = require("mongoose");
const commentSchema = require("./comment")

const postSchema = mongoose.Schema({
  _Id: {
  type: Number,
  required: true,
  },
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  comment: [commentSchema],

  userName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
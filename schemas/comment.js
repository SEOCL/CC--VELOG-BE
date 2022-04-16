const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    postId: {
    type: Number,
    required: true,
  },
  commentId: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  dateComment: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);

const mongoose = require("mongoose");


const commentSchema = mongoose.Schema({
  postId: {
    type: Number,
    
  },
  userId: {
    type: String,
    
  },
  commentId: {
    type: Number,
    
   
  },
  userName: {
    type: String,
    
  },
  comment: {
    type: String,
    
  },
  dateComment: {
    type: Date,
   
  },
});

module.exports = mongoose.model("Comment", commentSchema);


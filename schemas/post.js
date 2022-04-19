const mongoose = require("mongoose");

const postSchema = mongoose.Schema({ 
  postId: {
    type: Number    
  },
  image: {
    type: String    
  },
  title: {
    type: String    
  },
  content: {
    type: String   
  },
  date: {
    type: String,
    required: true,
  },
  userName: {
    type: String   
  },
  userId: {
    type: String   
  }
});

module.exports = mongoose.model("Post", postSchema);
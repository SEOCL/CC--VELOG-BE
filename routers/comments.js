const express = require("express");
const Comment = require("../schemas/comment");
const Post = require("../schemas/post")
const User = require("../schemas/user");
const authMiddleware = require("../middleware/authMiddleWare");
const router = express.Router();

// 댓글 작성
//댓글  api에 authMiddleware 추가해야 함. 테스트 위해서 제거
router.post("/comment/:postId", authMiddleware, async (req, res) => {
  try {
    const {comment} = req.body
    const {postId} = req.params;
    console.log("id->", postId);
    console.log(comment)
    const {user} = res.locals;
    const userId = user[0].userId;
    const userName = user[0].userName
    //0번째부터 
    //내림차순 정렬
  const commentIdList = await Comment.find({commentId}).sort({ "commentId": -1 });
  // console.log('2222-->',commentIdList)
  var commentId = 0;
    if(commentIdList.length == 0 || commentIdList == null || commentIdList == undefined){
      commentId = 1;
  }else{
    commentId = commentIdList[0].commentId+1
  }
    const dateComment = new Date();
    

    await Comment.create({
      postId,
      commentId,
      comment,
      dateComment,
      userName,
      userId
    });

    res.status(200).json({ result: true, msg: "댓글 작성이 완료되었습니다."});
  } catch (error) {
    console.log(error);
    console.log("comments.js -> 댓글 작성에서 에러남");
    
    res.status(400).json({ result: false, msg:"댓글 작성에 실패하였습니다." });
  }
});
  
  //댓글 수정
  router.patch("/comment/:postId", authMiddleware, async (req, res) => {
      try {
          const {commentId, comment} = req.body;
          const {postId} = req.params;
          const dateComment = new Date();

          await Comment.updateOne({postId, commentId}, {$set:{comment, dateComment}});
          //await Articles.updateOne( { articleNumber: articleNumber }, { $set: req.body } );
          console.log(postId, commentId)
          console.log(comment, dateComment)

          
          res.status(200).json({msg: "댓글이 정상적으로 수정됐습니다."});
      } catch (error) {
          console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
          res.status(400).json(
              {errorMessage: "댓글 수정에 실패하였습니다."}
          );
      }
  })

  // 댓글 삭제
  router.delete("/comment/:postId",authMiddleware, async (req, res) => {
    try {
      const {commentId } = req.body;
      const {postId} = req.params;
      console.log("commentId-->", commentId);

      await Comment.deleteOne({postId, commentId});

      res.status(200).json({ result: true });
    } catch (error) {
      console.log(error);
      console.log("comments.js -> 댓글 삭제에서 에러남");
  
      res.status(400).json({ result: false });
    }
  });
  
  module.exports = router;

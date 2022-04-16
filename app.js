const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const connect = require("./schemas")
const authMiddleware = require("./middleware/authMiddleWare")

connect();


//라우터 불러오기
const commentRouter = require("./routers/comments")
const postsRouter = require("./routers/posts")
const usersRouter = require("./routers/users")

// 접속 로그 남기기**
const requestMiddleware = (req, res, next) => {
    console.log(
      "[Ip address]:",
      req.ip,
      "[method]:",
      req.method,
      "Request URL:",
      req.originalUrl,
      " - ",
      new Date()
    );
    next();
  };

//각종 미들웨어 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(requestMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use('/user', usersRouter);
//32, 34번 코드 차이? 

//라우터 연결




//서버 열기
app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!");
  });
  
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const connect = require("./schemas")
const authMiddleware = require("./middleware/authMiddleWare")
const passportConfig = require("./passport");
connect();
passportConfig();

app.use(cors());

//라우터 불러오기
const commentRouter = require("./routers/comments")
const postsRouter = require("./routers/posts")
const usersRouter = require("./routers/users")
const authRouter = require("./routers/auth")
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

app.use(express.json());
app.use(requestMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use('/user', usersRouter);
app.use("/api", [postsRouter, commentRouter]);
app.use("/auth", authRouter);

//라우터 연결


//서버 열기
app.listen(port, () => {
    console.log(port, "포트로 서버가 켜졌어요!");
  });
  

module.exports = app
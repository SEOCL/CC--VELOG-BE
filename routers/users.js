const express = require("express");
const User = require("../schemas/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authMiddleWare = require("../middleware/authMiddleWare");
const router = express.Router();

// signup
router.post("/signup", async (req, res) => {
    console.log('user/signup')

        const {userId, password, passwordCheck, userName } = req.body;

        // Validation Check
        var usernameReg = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,10}$/ //1~10자 한글,영문,숫자
        var userIdReg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
        var passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,15}$/; //4~15자 영문+숫자
        
        // signup -> userId, userName 중복검사
        const existUsers = await User.find({
            $or: [ {userId}, {userName} ],
        });

        if(userId == "" || userId == undefined || userId == null){
            res.status(400).send({
                errorMessage : '아이디를 입력하세요.'
            });
            return;
        }else if(!userIdReg.test(userId)){
            res.status(400).send({
                errorMessage : '이메일 형식이 아닙니다.'
            });
            return;
        }else if(userName == "" || userName == undefined || userName == null){
            res.status(400).send({
                errorMessage : '닉네임을 입력하세요.'
            });
            return;
        }else if(!usernameReg.test(userName)){
            res.status(400).send({
                errorMessage : '닉네임은 1~10자, 한글,영문 및 숫자만 가능합니다.'
            });
            return;
        }else if(existUsers.length) {
            res.status(400).send({
                errorMessage : '이미 가입된 아이디 또는 닉네임 입니다.'
            });
            return;
        }else if(password == "" || password == undefined || password == null){
            res.status(400).send({
                errorMessage : "비밀번호를 입력하세요."
            })
            return;
        }else if(passwordCheck == "" || passwordCheck == undefined || passwordCheck == null){
            res.status(400).send({
                errorMessage : "비밀번호 확인란을 입력하세요."
            })
            return;
        }else if(!passwordReg.test(password)){
            res.status(400).send({
                errorMessage : '4~15자, 영문 및 숫자만 가능합니다.'
            });
            return;

        }else if(password !== passwordCheck){
            res.status(400).send({
                errorMessage : "비밀번호가 일치하지 않습니다."
            })
            return;
        }
        
        // bcrypt module -> 암호화
        // 10 --> saltOrRound --> salt를 10번 실행 (높을수록 강력)
        const hashed = await bcrypt.hash(password,10);
        const user = new User({ userId, userName, password : hashed})
        console.log('user-->',user);
        await user.save();

        res.status(200).send({
             msg : "회원가입 완료",
             userId,
             userName
        })
});

// login
router.post("/login", async (req, res) => {
    console.log('login api')
    const{ userId, password } = req.body;
    console.log('body->',userId, password);
    const user = await User.findOne({userId});
    console.log('user-->',user)
    // console.log('userPassword',user.password)

    // body passowrd = unHashPassword -->true
    const unHashPw = await bcrypt.compareSync(password, user.password)
    console.log('unHashPw->',unHashPw)
    // userId, password 없는경우
    if(user.userId !== userId || unHashPw==false) {
        res.status(400).send({
            errorMessage : "아이디 또는 비밀번호가 틀렸습니다."
        })
        return;
    }

    const token = jwt.sign({ userId : user.userId }, "velog-secret-key");
    res.status(200).send({
        token,
        userId,
    });
});

// 새로고침 login check
router.get("/loginCheck", authMiddleWare, (req, res) => {
    const { user } = res.locals;
    console.log('loginCheck user-->',user);
    const userId = user[0].userId;
    const userName = user[0].userName;
    console.log('userId-->',userId);
    console.log('userName-->',userName);
    res.status(200).send({
        userId : userId,
        userName : userName
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const passport = require('passport')
const jwt = require("jsonwebtoken");


router.get('/kakao', passport.authenticate('kakao'));

const kakaoCallback = (req, res, next) => {
  passport.authenticate(
    "kakao",
    { failureRedirect: "/" },
    (err, user, info) => {
      if (err) return next(err);
      console.log("콜백~~~")
      const { userId, userName } = user;
      const token = jwt.sign({userId: userId}, 'velog-secret-key');
     
      res.json({ token, userId, userName });
    }
  )(req, res, next);  
 
};
router.get("/kakao/callback", kakaoCallback);
module.exports = router;
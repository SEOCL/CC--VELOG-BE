const express = require('express')
const Post = require('../schemas/post')
const router = express.Router()
const Comment = require("../schemas/comment")
const authMiddleware = require("../middleware/authMiddleWare")

const path = require("path");
 let AWS = require("aws-sdk");
 AWS.config.loadFromPath(path.join(__dirname, "../config/s3.json")); // 인증
 let s3 = new AWS.S3();

 let multer = require("multer");
 let multerS3 = require('multer-s3');
 let upload = multer({

     storage: multerS3({
         s3: s3,
         bucket: "sparta-bucket-jw",
         key: function (req, file, cb) {
              let extension = path.extname(file.originalname);
              cb(null, Date.now().toString() + extension)
         },
         acl: 'public-read-write',
     })
 })

//게시글작성
router.post('/post', authMiddleware,upload.single('image'), async (req, res) => {
	try {
		console.log("req.file:", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음 
		const { title, content } = req.body
		const image = req.file.location
		const { user } = res.locals
		const userName = user[0].userName
		const userId = user[0].userId

		console.log(title, content,image,userName, userId, )

		let today = new Date();
		let date = today.toLocaleString()
		let postId = 0
		const Post_ls = await Post.find();
		if (Post_ls.length) {
			postId = Post_ls[Post_ls.length - 1]['postId'] + 1
		} else {
			postId = 1
		}
		 if( !title || !image || !content ){
		 return res.status(400).json({
		 errorMessage: "빈칸 없이 모두 입력해주세요"		
		 });	
		 }	
		await Post.create({ postId, title, content, date, userName, userId, image });
		return res.status(200).json({
			success: "등록 완료"
		});

	} catch (err) {
		console.log(err)
		res.status(400).send({
			errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
		});
	}
});

//게시글 삭제
 router.delete("/delete/:postId",authMiddleware, async(req, res) =>{
 	const { postId } = req.params
 	console.log(postId)
 	const {user} = res.locals;
 	const exist = await Post.find({postId: Number(postId)})  // 현재 URL에 전달된 id값을 받아서 db찾음

 	const url = exist[0].image.split('/')    // exist 저장된 fileUrl을 가져옴

 	const delFileName = url[url.length - 1]

 	await Post.deleteOne({postId: Number(postId)});
 	s3.deleteObject({
 			Bucket: 'sparta-bucket-jw',
 			Key: delFileName
 	}, (err, data) => {
 			if (err) { throw err; }
 	});
 	res.json({success: "삭제가 완료되었습니다!"});
 });

// //게시글 수정
 router.post("/modify/:postId",authMiddleware, upload.single('image'), async (req, res)=>{
 	const { postId } = req.params
 	const { title, content } = req.body
     console.log(req.file)
	 let today = new Date();
	let date = today.toLocaleString()
     let image
     const {user} = res.locals;
     if(!req.file){
         const exist = await Post.find({postId: Number(postId)})
          image = exist[0].image

     }else{
          image = req.file.location        
     }

     if( !title || !image || !content ){
 		return res.status(400).json({
 			errorMessage: "빈칸 없이 모두 입력해주세요"		
 		});	
 	}	 

     console.log(image)
 	const exist = await Post.find({postId: Number(postId)})  // 현재 URL에 전달된 id값을 받아서 db찾음	
 	const url = exist[0].image.split('/')    // exist 저장된 fileUrl을 가져옴
 	const delFileName = url[url.length - 1]
 		s3.deleteObject({
 		Bucket: 'sparta-bucket-jw',
 		Key: delFileName
 		}, (err, data) => {
 			if (err) { throw err; }
 		});

 	await Post.updateOne({postId: Number(postId)}, { $set: {title, content, image , date }}) 	


 	 res.json({success: "수정이 완료되었습니다!"})
 })

//메인페이지 불러오기
router.get('/post', async (req, res) => {	

const post = await Post.find({}).sort({"postId": -1});

res.json({
 		post
 	});
});

 //상세페이지 불러오기
 router.get("/detail/:postId", async (req, res) => {
 	const { postId } = req.params;	
 	const post = await Post.find({ postId: Number(postId) });
	 const comment = await Comment.find({ postId: Number(postId) });
 	res.json({
 		post, comment
 	});
 });


module.exports = router;
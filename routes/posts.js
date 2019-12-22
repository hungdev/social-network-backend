// var express = require('express');
// var router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/checkAuth');
const PostController = require('../controllers/post');
import upload from '../middleware/upload'
var router = global.router;


/* GET users listing. */
router.get("/get-all-post", PostController.get_all_post);

router.put("/update-post", checkAuth, PostController.update_post);

router.get("/get-detail-post", PostController.get_detail_post);

router.post("/create-post", checkAuth, upload.single('imageUrl'), PostController.create_post);

router.get("/open-image", PostController.open_image);

router.delete("/post/:postId", PostController.post_delete);

router.delete("/post-delete-many", PostController.post_delete_many);
router.delete("/post-delete-all", PostController.post_delete_all);


module.exports = router;

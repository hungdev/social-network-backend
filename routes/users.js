// var express = require('express');
// var router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const UserController = require('../controllers/user');
import upload from '../middleware/upload'
var router = global.router;

/* GET users listing. */
router.get("/get-users", UserController.get_users);

router.get("/get-stranger-users", checkAuth, UserController.get_stranger_users);

router.get("/get-me", checkAuth, UserController.get_me);

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.put("/update-user", checkAuth, upload.single('avatarUrl'), UserController.update_user);

router.delete("/user/:userId", checkAuth, UserController.user_delete);

module.exports = router;

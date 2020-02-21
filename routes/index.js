// import express from 'express';
// var router = express.Router();
global.router = require('express').Router();
var router = global.router;
router = require('./users');
router = require('./posts');

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.redirect('https://fb.com/hungvu.net');
});

// export default router;
module.exports = router;

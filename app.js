const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

var app = express();


// Connect DB:
var mongoose = require('mongoose');
let options = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  user: 'hungvu',
  pass: 'vuhung',
  // useNewUrlParser: true,
  // useUnifiedTopology: true
};
// Use native Promises
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/socialMongoDB', options).then(
  () => {
    console.log("connect DB successfully");
  },
  err => {
    console.log('Connection failed. Error: ${err}');
  }
);

// bypass cors
const whitelist = [
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:5001',
  'http://localhost:4000',
  'http://localhost:4001',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5000',
  'http://localhost:5001',
  'http://localhost:8080',
  'http://localhost:8181'
];
if (process.env.APP_URL) {
  whitelist.push(process.env.APP_URL);
}
if (process.env.WHITE_LIST && typeof process.env.WHITE_LIST === 'string') {
  const whiteListEnv = process.env.WHITE_LIST.split(',');
  _.forEach(whiteListEnv, (value) => {
    whitelist.push(value);
  });
}
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin || !helper.isURL(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.get('/', (req, res) => res.send('Hello World!'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

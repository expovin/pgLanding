var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

let staticRoot = path.resolve(__dirname, '..', 'dist');
app.use(express.static(staticRoot));

passport.serializeUser(function(user, done) {
  done(null, user.oid);
});

passport.deserializeUser(function(oid, done) {
  findByOid(oid, function (err, user) {
    done(err, user);
  });
});

app.get('/*', function(req, res, next) {
  if (req.originalUrl.indexOf("/api/") !== -1) {
      return next();
  } else {
      res.sendFile(path.join(staticRoot, 'index.html'));
  }
});

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
 var allowedOrigins = ['http://127.0.0.1:3000', 'http://127.0.0.1:4200', 'http://localhost:3000', 'http://localhost:4200',
                       'http://itmil-ves:3000', 'http://itmil-ves:4200', 'http://itmil-ves, http://localhost',
                       'https://itmil-ves/'];

 var origin = req.headers.origin;
if(origin) origin = origin.toLowerCase();
 if(allowedOrigins.indexOf(origin) > -1){
   res.setHeader('Access-Control-Allow-Origin', origin);
 }


 // Request methods you wish to allow
 res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
 // Request headers you wish to allow
 res.setHeader('Access-Control-Allow-Headers', 'gameID,content-type,X-Requested-With,x-access-token');

 // Set to true if you need the website to include cookies in the requests sent
 // to the API (e.g. in case you use sessions)
 res.setHeader('Access-Control-Allow-Credentials', true);

 // Pass to next layer of middleware
 next();
});



app.use('/', indexRouter);
//app.use('/api/v1/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

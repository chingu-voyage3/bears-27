var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var mongoose = require('mongoose');
var passport = require('passport');

const MONGO_URI = process.env.MONGO_DB
var app = express();
mongoose.Promise = global.Promise;

mongoose.connect(MONGO_URI, {
  useMongoClient: true
});



// Use EJS at the default view engine.
app.set('view engine', 'ejs');
app.use(logger('dev'));

//Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
console.log("MONGO::: " + mongoose.connection.readyState);


// Serve static assets
app.use(express.static(path.resolve(__dirname, 'client', 'public')));

// Needed for login
app.use(require('express-session')({ secret: 'random string', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Routes
app.use('/', index);
let food = require('./routes/food')
app.use('/food', food)
let auth = require('./routes/auth')
app.use('/auth', auth)
let events = require('./routes/events')
app.use('/events', events)
let users = require('./routes/user')
app.use('/users', users)
let itineraries = require('./routes/itineraries')
app.use('/itineraries', itineraries)

//TODO: Remove this
let test = require('./routes/test');
app.use('/test', test);


// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

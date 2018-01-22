const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/User');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var router = express.Router();

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("MONGO::: " + mongoose.connection.readyState);    
       User.findOrCreate(null, profile.id, profile.name.familyName, profile.name.givenName, 
        function (err, user) {
            return done(err, user);
       });
  }
));

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/google',
passport.authenticate('google',
 { scope: ['profile'] })
);


// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      console.log(req.user);
        res.status(200).json(req.user);
    });




module.exports = router;
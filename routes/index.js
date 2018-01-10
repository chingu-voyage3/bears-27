var express = require('express');
var router = express.Router();
let User = require('../models/User')

//Homepage
router.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, '..','client' ,'public', 'index.html'));
});

router.get('/login', function(req, res){
  res.send('<a href="/auth/google">Sign In with Google</a>')
})

router.get('/profile', function(req, res){
  // We need to find the user each time they load /profile, otherwise their information will
  // not update until they log in again.
  if(!req.user){
    res.redirect('/login')
  }
  let googleID = String(req.user.googleID);
  User.findOne({
    googleID: googleID
  }).then(
    (result) => {
      res.json(result)
    }
  )
})
module.exports = router;

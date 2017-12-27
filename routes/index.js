var express = require('express');
var router = express.Router();


//Homepage
router.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, '..','client' ,'public', 'index.html'));
});

router.get('/login', function(req, res){
  res.send('<a href="/auth/google/login">Sign In with Google</a>')
})

router.get('/profile', function(req, res){
  console.log(req)
  res.json(req.user);
})
module.exports = router;

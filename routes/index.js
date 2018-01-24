var path = require('path');
var express = require('express');
var router = express.Router();
let User = require('../models/User')

//Homepage
router.get('/', function (req, res) {
  console.log("THIS LINE DOESNT RUN, because if we serve the build folder as public it detects the index.html");
  res.sendFile(path.resolve(__dirname, '..','client' ,'build', 'index.html'));
});


router.get('/profile', function(req, res){
  // We need to find the user each time they load /profile, otherwise their information will
  // not update until they log in again.
  if(!req.isAuthenticated()){
    res.status(401).send("Unauthorized");
  }
  let userID = String(req.user._id);
  User.findOne({
    _id: userID
  }).then((result) => {
      res.json(result)
    })
    .catch((error) => {
      res.status(401).send(String(error));
    })

})
module.exports = router;

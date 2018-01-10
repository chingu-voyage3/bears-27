let express = require('express');
let router = express.Router();
let User = require('../models/User');


router.get('/', function(req, res){
    //Return a list of all Users, provided the user is logged in an an admin
    if(!req.user){
        res.send("You do not have permissions to access this page")
    }
    else if (!req.user.isAdmin){
        console.log("user isnt an admin")
        res.send("You do not have permissions to access this page")
    }
    else{
        User.find({})
        .then(
            (results) => {
                res.json(results)
            }
        ).catch(
            (error) => {
                console.log(error)
                res.send("Could not find any results");
            }
        )
    }
})

router.get('/addPlannedEvent/:id', function(req, res){
    if(!req.user){
        res.send("You must be logged in to complete this action")
    }
    else{
    let eventID = req.params.id;
    User.addPlannedEvent(req.user.googleID , eventID, function(error, result){
        if(!error && result){
            res.send("Added event");
        }
        else{
            res.send("Could not add event");
        }
    })
    }
})

router.get('/addPossibleEvent/:id', function(req, res){
    if(!req.user){
        res.send("You must be logged in to complete this action")
    }
    else{
    let eventID = req.params.id;
    User.addPossibleEvent(req.user.googleID , eventID, function(error, result){
        if(!error && result){
            res.send("Added event");
        }
        else{
            res.send("Could not add event");
        }
    })
    }
})

module.exports = router;

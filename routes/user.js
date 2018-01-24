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
        res.status(401).send("You do not have permissions to access this page")
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
                res.status(500).send("Unable to complete request");
            }
        )
    }
})

router.get('/addStarred', function(req, res){
    let yelpID = req.body.yelpID;
    let yelpName = req.body.yelpName;
    if(req.isAuthenticated()){
        User.addStarredLocation(req.user._id, yelpID, yelpName, function(error, result) {
            if(error || !result){
                res.send("Failed to star location")
            }
            else {
                res.send("Location starred")
            }
        } )
    }
    else {
        res.status(401).send("You must be logged in to star locations")
    }
})
router.get('/myPlannedEvents', function(req, res){
    if(req.isAuthenticated()){
        User.findOne({"_id" : req.user._id})
        .then((result) => {
            res.json(result.plannedEvents)
        })
    }
    else {
        res.status(401).send("You need to be logged in to view this page")
    }
})

router.get('/addPlannedEvent/:id', function(req, res){
    if(!req.isAuthenticated()){
        res.status(401).send("You must be logged in to complete this action")
    }
    else
    {
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
            res.status(500).send("Could not add event");
        }
    })
    }
})

module.exports = router;

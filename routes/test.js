var express = require('express');
var router = express.Router();
var User = require('../models/User');
var TripEvent = require('../models/TripEvent');
var mongoose = require('mongoose');

router.get('/addstarred', function(req, res){
    User.addStarredLocation('5a621090080cec4e90938dc7', 'arizona-jazz-festival-at-the-wigwam-litchfield-park', 'Arizona Jazz Festival At the Wigwam', function(err, result){
        if(result){
            res.send(result)
        }
        else {
            res.send("Failed to add location")
        }
    })
})

router.get('/test5', function(req, res){
    TripEvent.createNewEvent("yelp", "gary-danko-san-francisco", "1/1/1", function(err, result){
        if(err | !result){
            res.send("failed to find")
        }
        else {
            res.send(result);
        }
    })

})
router.get('/test1', function (req, res){
    console.log("????");
    console.log("MONGO::: " + mongoose.connection.readyState);

    var testEvent = {
        locationName: "Home", 
        rating: 5, 
        address: "123 4TH St",
        possiblyAttending: [],
        confirmedAttending: [],
        EventDate: Date.now()
    }
    console.log("MONGO ::: " + mongoose.connection.readyState);
    
    TripEvent.create(testEvent, function(error, createdEvent){
        if(error || !createdEvent){
            console.log("Could not create Event");
            res.send("Could not create event");
        }
        else {

            res.json(createdEvent)
        }
    })
})
router.get('/test4', function(req, res){
    let userID = req.user._id;
    TripEvent.addConfirmedAttending(googleID,"5a49143a230acb1ec4c72949", function(err, result){
        if(err){
            console.log(err);
        }
        if(result && !err){
            console.log("All good");
        }
    })
    User.findOne({"_id": userID})
    .exec()
    .then((result) => {
        res.json(result);
    })
})
router.get('/newEvent', function (req, res){
    console.log("MONGO::: " + mongoose.connection.readyState);

    var testEvent = {
        locationName: "Home", 
        rating: 5, 
        address: "123 4TH St",
        possiblyAttending: [],
        confirmedAttending: [],
        EventDate: Date.now()
    }
    console.log("MONGO ::: " + mongoose.connection.readyState);
    
    TripEvent.create(testEvent, function(error, createdEvent){
        if(error || !createdEvent){
            console.log("Error:" + error);
            res.send("Could not create event");
        }
        else {
            User.find({"googleID": req.user.googleID},function (err, result){
                if(err || !result){
                    console.log("failed to find user");
                }
                else { 
                    console.log(result);
                    createdEvent.confirmedAttending.push(result._id);
                    createdEvent.save();
                    User.addPlannedEvent(req.user.googleID, createdEvent._id, function (){});
                }
            })
            
            res.json(createdEvent)
        }
    })
})


module.exports = router;

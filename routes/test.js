var express = require('express');
var router = express.Router();
var User = require('../models/User');
var TripEvent = require('../models/TripEvent');
var mongoose = require('mongoose');
router.get('/test5', function(req, res){
    TripEvent.createNewEvent("yelp", "gary-danko-san-francisco", null, function(err, result){
        if(err | !result){
            res.send("failed to find")
        }
        else {
            res.send(result.jsonBody);
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
    let googleID = req.user.googleID;
    TripEvent.addConfirmedAttending(googleID,"5a49143a230acb1ec4c72949", function(err, result){
        if(err){
            console.log(err);
        }
        if(result && !err){
            console.log("All good");
        }
    })
    User.findOne({"googleID": googleID})
    .exec()
    .then((result) => {
        res.json(result);
    })
})
router.get('/test3', function(req, res){
    User.addPlannedEvent(req.user.googleID,
         "5a49143a230acb1ec4c72949", function(err, result){
             if(err){
                 res.send(err);
             }
             else {
                 res.send(result)
             }
         });
})
router.get('/test2', function (req, res){
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
            User.find({"googleID": req.user.googleID},function (err, result){
                if(err || !result){
                    console.log("failed to find user");
                }
                else { 
                    console.log(result);
                    createdEvent.confirmedAttending.push(result);
                    createdEvent.save();
                    User.addPlannedEvent(req.user.googleID, createdEvent._id);
                }
            })
            
            res.json(createdEvent)
        }
    })
})


module.exports = router;

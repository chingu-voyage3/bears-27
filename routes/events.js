let express = require('express');
let router = express.Router();
let TripEvent = require('../models/TripEvent');
let Itinerary = require('../models/Itinerary');

router.get('/', function(req, res){
    //Return a list of all TripEvents
    TripEvent.find({})
    .then(
        (results) => {
            res.json(results)
        }
    ).catch(
        () => {
            res.send("Unable to complete that request");
        }
    )
})

router.post('/', function(req, res){
    let yelpID = req.body.yelpID;
    let date = req.body.date;
    if(!req.isAuthenticated()){
        res.status(401).send("Unauthorized");
    }
    else{
    TripEvent.createNewEvent("yelp", yelpID, date, function(err, result){
        if(err | !result){
            res.status(500).send('Failed to create event')
        }
        else {
            Itinerary.addEvent(date,req.user._id, req.user.current_itinerary, result._id, ()=>{})
            res.send(result);

        }
    })
}

})
/* 
    Example usage: example/api/some-location-name/12-25-2018
    Returns: An array of TripEvents that fall within 1 day of a date
*/
router.get('/:id/:date', function(req, res){
    // Finds events happening at a given location within 1 day of the provided date (if valid)
    // otherwise within 1 day of today.
    let locationID = req.params.id 
    let date;
    if(!isNaN((Date.parse(req.params.date)))) {
        date = new Date(req.params.date);
    }
    else {
        // As of right now we are setting the date to the current date if for some reason the route is provided 
        // An invalid input
        date = new Date();
    } 
    let startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    TripEvent.find({
        "locationID": locationID,
        "EventDate": {
            $gte: startDate,
            $lt: endDate
        }
    })
    .then((results) => {
        if(!results || results.length == 0) {
            throw new Error("No Results Found")
        }
        else {
            res.send(results)
        }
    })
    .catch((error) => {
        res.send(error.message)
    })
})

router.get('/attending/:id/:date', function(req, res){
    // Finds the names of people attending events a given location within 1 day of the provided date (if valid)
    // otherwise within 1 day of today.
    let locationID = req.params.id 
    let date;
    if(!isNaN((Date.parse(req.params.date)))) {
        date = new Date(req.params.date);
    }
    else {
        // As of right now we are setting the date to the current date if for some reason the route is provided 
        // An invalid input
        date = new Date();
    } 
    let startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

    TripEvent.find({
        "locationID": locationID,
        "EventDate": {
            $gte: startDate,
            $lt: endDate
        }
    })
    .then((results) => {
        if(!results || results.length == 0) {
            throw new Error("No Results Found")
        }
        else {
            res.send(results)
        }
    })
    .catch((error) => {
        res.status(500).send(error.message)
    })
})

module.exports = router;

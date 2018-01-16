let express = require('express');
let router = express.Router();
let TripEvent = require('../models/TripEvent');


router.get('/', function(req, res){
    //Return a list of all TripEvents
    TripEvent.find({})
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
})


router.get('/attending/:id/:date', function(req, res){
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
    console.log(date)
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
        if(!results || results.length == 0){
            throw new Error("No Results Found")
        }
        res.send(results)
    })
    .catch((error) => {
        res.send(error.message)
    })
})

module.exports = router;

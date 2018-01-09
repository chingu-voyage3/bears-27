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


module.exports = router;

let express = require('express');
let router = express.Router();
let Itinerary = require('../models/Itinerary');
let TripEvent = require('../models/TripEvent');

router.get('/', function(req, res){
    //Return a list of all public itineraries
    Itinerary.find({public: true})
    .then(
        (results) => {
            res.json(results)
        }
    ).catch(
        () => {
            res.send("Unable to list results");
        }
    )
})

router.get('/mine/', function(req,res){
    if(!req.isAuthenticated()){
        res.redirect('/login');
    }
    Itinerary.find({
        owner: req.user._id
    })
    .then((result) => {
        res.json(result);
    })
    .catch((error) => {
        res.send(error);
    })
})

router.get("/edit/:id", function(req, res){
    //TODO: Implement
})

router.get("/delete/:id", function(req, res){
    //TODO: Implement
})

router.get('/addEvent/:itineraryID/:eventID', function(req, res){
    //TODO: Fix this
    let tripID = req.params.eventID;
    let itID = req.params.itineraryID;
    let userID = req.user._id;
    TripEvent.findOne({"_id": tripID})
    .then((event) => {
        Itinerary.addEvent(Date.parse("1/2/2003"), userID,  itID, event._id, (err, itinerary) => {
            res.send(itinerary)
        } )
    })
})

router.post('/new', function(req, res){
    //TODO: Fix this
    let date = String(req.body["eventDate"]);
    let isPublic = Boolean(req.body["isPublic"]);
    let userID = req.user ? req.user._id: null;
    date = Date.parse(date)
    if(userID){
        Itinerary.createNew(date, isPublic, userID, function(err, result){
            console.log(err)
            res.json(result);
        });
    }
    else {
        res.send("You must be logged in to create an itinerary");
    }
})

router.get('/:id', function(req, res){
    let userID = null;
    let ID = req.params.id;
    if(req.isAuthenticated()){
        userID = req.user._id;
    }
    Itinerary.findOne({ _id: ID})
    .then((result) => {
        //Determine if the user should be able to see it.
        if(result.public == true){
            res.json(result);
        }
        else if (result.owner == userID){
            res.json(result);
        }
        else if (result.sharedWith.indexOf(userID) > -1){
            res.json(result);
        }
        else {
            res.send("You are not allowed to view this itinerary")
        }

    })
    .catch((error) => {
        res.send(error);
    })
})



module.exports = router;

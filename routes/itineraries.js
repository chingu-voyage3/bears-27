let express = require('express');
let router = express.Router();
let Itinerary = require('../models/Itinerary');


router.get('/', function(req, res){
    //Return a list of all Itinerarie
    Itinerary.find({})
    .then(
        (results) => {
            res.json(results)
        }
    ).catch(
        (error) => {
            res.send("Unable to list results");
        }
    )
})

router.get('/mine/', function(req,res){
    let userID = req.user ? req.user._id: null;
    Itinerary.find({
        owner: userID
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
    //TODO: Implement
})

router.post('/new', function(req, res){
    let date = String(req.body["eventDate"]);
    let isPublic = Boolean(req.body["isPublic"]);
    let userID = req.user ? req.user._id: null;
    if(userID){
        Itinerary.createNew(date, isPublic, userID, function(err, result){
            res.json(result);
        });
    }
    else {
        res.send("You must be logged in to create an itinerary");
    }
})

router.get('/:id', function(req, res){
    let ID = req.params.id;
    Itinerary.findOne({ _id: ID})
    .then((result) => {
        res.json(result);
    })
    .catch((error) => {
        res.send(error);
    })
})



module.exports = router;

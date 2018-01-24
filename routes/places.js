const GMAPS_API_KEY = process.env.GMAPS_API_KEY
const YELP_API_KEY = process.env.YELP_API_KEY
var express = require('express');
var router = express.Router();
const yelp = require('yelp-fusion');
const client = yelp.client(YELP_API_KEY);
const TripEvent = require('../models/TripEvent')

router.get('/near/:zipcode/category/:category', function (req, res) {
    let zipcode = String(req.params.zipcode);
    let category = String(req.params.category);
    // Endpoint to allow people to find certain categories of things near a zipcode. 
    // As a note it appears that if your category isnt found it just ignores it? 
    // IE if you do a search for asdf it will return all results in the zip code
    // But if you do bars it will only return bars.
    // this causes the problem of typos, but if we make it so that the user cannot/doesnt directly access the API
    // this might be fine? 
    client.search({
        categories: category,
        location: zipcode
    }).then(yelpdata => {
        res.send(yelpdata.jsonBody);
    }).catch(yelperror => {
        res.send(yelperror);
    })
  });

  router.get('/near/:lat/:long/category/:category', function (req, res) {
    let long = String(req.params.long);
    let lat = String(req.params.lat);
    let category = String(req.params.category);
    // Endpoint to allow people to find certain categories of things near a zipcode. 
    // As a note it appears that if your category isnt found it just ignores it? 
    // IE if you do a search for asdf it will return all results in the zip code
    // But if you do bars it will only return bars.
    // this causes the problem of typos, but if we make it so that the user cannot/doesnt directly access the API
    // this might be fine? 
    client.search({
        categories: category,
        longitude: long,
        latitude: lat,
    }).then(yelpdata => {
        res.send(yelpdata.jsonBody);
    }).catch(yelperror => {
        res.send(yelperror);
    })
  });
router.get('/near/:zipcode', function (req, res) {
    let zipcode = req.params.zipcode;
    client.search({
        term:'events', 
        location: zipcode
    }).then(yelpdata => {
        res.json(yelpdata.jsonBody);
    }).catch(yelperror => {
        res.send(yelperror);
    })
  });

  router.get('/near/:lat/:long', function (req, res) {
    let lat = req.params.lat;
    let long = req.params.long;
    client.search({
        term:'events', 
        latitude: lat, 
        longitude: long,
    }).then(yelpdata => {
        res.json(yelpdata.jsonBody);
    }).catch(yelperror => {
        res.send(yelperror);
    })
  });

router.get('/details/:id', function (req, res){
    //Find the event with the provided yelp ID
    let placeID = req.params.id
    TripEvent.find({"locationID": placeID}).then(
        (results) => {
            if(results.length == 0){
                {
                    res.send("None yet")
                }
            }
            else {res.send(results)}
        })
})

router.get('/createEvent/:id/:dateString', function(req, res){
    // Creates a new event, or if that place already has an event that day return that one. 
    // TODO: Indicate that the event was already happening.
    let placeID = req.params.id    
    let date = Date.parse(String(req.params.dateString))
    TripEvent.findOrCreate('yelp', placeID , date, function(error, result){
        if(error){
            res.send(error)
        }
        else {
        res.send(result)
        }
    })
})

  module.exports = router;
  
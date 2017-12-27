const GMAPS_API_KEY = process.env.GMAPS_API_KEY
const YELP_API_KEY = process.env.YELP_API_KEY
var express = require('express');
var router = express.Router();
const yelp = require('yelp-fusion');
const client = yelp.client(YELP_API_KEY);


router.get('/json/near/:zipcode/category/:category', function (req, res) {
    let zipcode = String(req.params.zipcode);
    let category = String(req.params.category);
    // Endpoint to allow people to find certain categories of things near a zipcode. 
    // As a note it appears that if your category isnt found it just ignores it? 
    // IE if you do a search for asdf it will return all results in the zip code
    // But if you do bars it will only return bars.
    // this causes the problem of typos, but if we make it so that the user cannot/doesnt directly access the API
    // this might be fine? 
    console.log(zipcode);
    console.log(category);
        client.search({
            categories: category,
            location: zipcode
        }).then(yelpdata => {
            res.send(yelpdata);
        }).catch(yelperror => {
            res.send(yelperror);
        })
  });

router.get('/json/near/:zipcode', function (req, res) {
    let zipcode = req.params.zipcode;
    console.log(zipcode);
        client.search({
            term:'events', 
            location: zipcode
        }).then(yelpdata => {
            res.send(yelpdata);
        }).catch(yelperror => {
            res.send(yelperror);
        })
  });




  module.exports = router;
  
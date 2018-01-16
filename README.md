# bears-27

# Routes:
/events/ - Shows a list of all events in the database
/events/attending/{ID}/{Date} - Shows a list of people who will be at some place within 1 day of your given date, or if it fails 
    to parse your date it will look for people going within 1 day of the current date. 

/user/myPlannedEvents - Shows the contents of your planned events list
/user/addPlannedEvents/{id} - Adds an event with a matching ID to your planned events
/user/addPossibleEvents/{id} - Adds an event with a matching ID to your possible events

/places/near/{zipcode}/ - Shows an unfiltered list of results near a given zipcode
/places/near/{zipcode}/category/{category} - Shows a list of results for a given category.
    A list of categories can be found at https://www.yelp.com/developers/documentation/v3/all_category_list

(Note all of the below are unfinished)
/itineraries/ - Shows a list of all public itineraries
/itineraries/mine - Shows a list of your itineraries
/itineraries/addEvent/{itineraryID}/{eventID} - Adds an event to your itinerary
/itineraries/{id} - Show an itinerary, provided you are allowed to see it. 

/profile/ - Returns a json object with profile date (As or right now)

/login/ - Allows a user to login using Google sign in, possibly more in the future.
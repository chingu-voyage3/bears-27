
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

var itinerarySchema = new Schema({
    date: Date,
    public: Boolean,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    events: [{
        time: Date,
        eventData: { type: Schema.Types.ObjectId, ref: 'TripEvent' },
    }]
});
itinerarySchema.statics.removeEvent = (index, itID, userId, callback) => {
    Itinerary.findOne({"_id" : itID})
    .then(result => {
        if(result.owner == userId){
            result.events.splice(index, 1);
            result.save();
            callback(null, result);
        }
        else {
            throw new Error("You do not have permission to edit this itinerary")
        }

    })
    .catch((error) => {
        console.log(error);
        callback(error, null);
    })
}

itinerarySchema.statics.addEvent = (time,userId, itID, eventID, callback) => {
    //TODO: Verify that this is a valid action
    Itinerary.findOne({"_id" : itID})
    .then(result => {
        // Check to see if an itinerary was either shared with the provided user, or belongs to them
        // As of right now I have decided that you shouldnt be able to add events to a public itinerary
        // That wasnt shared with you.
        if((result.owner == userId) || result.sharedWith.includes(userId)){
        result.events.push({time: time, eventData: eventID})
        result.save();
        callback(null, result)
        }
        else {
            throw new Error("You do not have permission to edit this itinerary")
        }

    })
    .catch((error) => {
        callback(error, null);
    })
}

itinerarySchema.statics.createNew = (date, isPublic , owner , callback) => {
    let newObj = {
        date : date,
        public: isPublic, 
        owner: owner, 
    }
    Itinerary.create(newObj)
    .then((newEntry) => {
        callback(null, newEntry)
    })
    .catch((error) => {
        callback(error, null)
    })

                
}
var Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;
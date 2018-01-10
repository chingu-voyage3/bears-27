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

itinerarySchema.statics.createNew = (date, isPublic , owner , callback) => {
    let newObj = {
        date : Date(date),
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
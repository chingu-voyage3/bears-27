
//NOTE: The user object that is in the request parameter does not update after login.
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let TripEventSchema = require('./TripEvent');
let TripEvent = TripEventSchema.model;

// create a schema
var userSchema = new Schema({
  plannedEvents: [{ type: Schema.Types.ObjectId, ref: 'TripEvent' }],
  possibleEvents: [{ type: Schema.Types.ObjectId, ref: 'TripEvent' }],
  name: String,
  googleID: String,
  username: { type: String },
  password: { type: String },
  admin: Boolean,
  location: String,
  meta: {
    age: Number,
    website: String
  },
  created_at: Date,
  updated_at: Date,
  starredPlaces: [{
    yelpID: String,
    placeName: String,
  }], 
  current_itinerary: { type: Schema.Types.ObjectId, ref: 'Itinerary' }
});

userSchema.statics.addStarredLocation = function(ID, yelpID, yelpName, callback){
  let duplicateEntry = false;
  this.findOne({"_id": ID}) 
  .then((result) => {
    for(let i = 0 ; i < result.starredPlaces.length; i++){
      if (result.starredPlaces[i].yelpID == yelpID){
        duplicateEntry = true;
        break;
      }
    }
    if(!duplicateEntry){
      result.starredPlaces.push({
        yelpID: yelpID,
        placeName: yelpName
      })
      result.save()
    }

    callback(null, result)
  })
  .catch((error) => {
    callback(error, null )
  })
}

userSchema.statics.createUser = function(googleID, lastName, firstName, callback) {
  User.create({
    googleID: googleID,
    name: firstName + " " + lastName
  }).then( (result) => {
    if (!result){
      throw new Error("Failed to create user")
    }
    callback(null, result)
  })
  .catch((err) => {
    console.log(err);
    callback(err, null);
  })
}

userSchema.statics.findOrCreate = function(userID, googleID, lastName, firstName, callback){
  this.findOne({
    // As of right now we only support Google Oauth2, so it this checks the googleID provided by google
    // Against existing members. 
    googleID: googleID
  })
  .exec()
  .then((user) => {
    if(user){
      callback(null, user)
    }
    else {
      // No user was found, create a new one
      console.log("Creating a new user");
      User.createUser(googleID, lastName, firstName, callback)
    }
  })
  .catch((error) => {
    console.log("findOrCreate" + error);
    callback(error, null)
  })
}


// Possible unnessesary now
userSchema.statics.addPossibleEvent = function(userID, eventID, callback) {
  console.log("MONGO STATE::: " + mongoose.connection.readyState);
  
  this.findOne({"_id": userID})
  .exec()
  .then((user) => {
    TripEventSchema.findOne({"_id": eventID})
    .then(
      (result) => {
        return result;
      })
    .then((result) => {
      user.possibleEvents.push(result._id);
      user.save()
      .then(() => {
        callback(null, true)
      })
      .catch((error) => {
        callback(error, null)
      });
    })
    .catch((error) => {
      callback(error, null)
    })
  })
  .catch((error) => {
    callback(error, null);
  })
}
userSchema.statics.addPlannedEvent = function(userID, eventID, callback) {
  console.log("MONGO STATE::: " + mongoose.connection.readyState);
  
  this.findOne({"_id": userID})
  .exec()
  .then((user) => {
    TripEventSchema.findOne({"_id": eventID})
    .then((result) => {
      user.plannedEvents.push(result._id);
      user.save()
      .then((user) => {
        console.log(user)
        callback(null, true)
      })
      .catch((error) => {
        callback(error, null)
      });
    })
    .catch((error) => {
      callback(error, null)
    })
  })
  .catch((error) => {
    callback(error, null);
  })
}


var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
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
  updated_at: Date
});
userSchema.statics.addPossibleEvent = function(googleID, eventID, callback) {
  console.log("MONGO STATE::: " + mongoose.connection.readyState);
  
  this.findOne({"googleID": googleID})
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
userSchema.statics.addPlannedEvent = function(googleID, eventID, callback) {
  console.log("MONGO STATE::: " + mongoose.connection.readyState);
  
  this.findOne({"googleID": googleID})
  .exec()
  .then((user) => {
    TripEventSchema.findOne({"_id": eventID})
    .then(
      (result) => {
        return result;
      })
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
userSchema.statics.findOrCreate = function(googleID, lastName, firstName, callback){
  console.log("MONGO STATE::: " + mongoose.connection.readyState);
  //TODO: Determine if I actually need all of these catch statements. 
  this.findOne(
    {"googleID": googleID},
    function(err, user){
      if (err){
        return callback(err, null)
      }
      else if (!user){
        //TODO: Make users with more than just ID's and names
        newUser = {
          googleID: googleID, 
          name: firstName + " " + lastName, 
        }
        User.create(newUser, function(err, user){
          if(err){
            return callback(err, null);
          }
          else{
            return callback(null, user);
          }
        })
      }
      else{
        return callback(null, user);
    }
  })
}

var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
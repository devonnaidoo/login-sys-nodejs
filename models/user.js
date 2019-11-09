var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/login-sys-nodejs");

var db = mongoose.connection;

// User Schema - A schema is a collection of database objects
var UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  username: {
    type: String,
    index: true
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  profileimage: {
    type: String
  }
});

var User = (module.exports = mongoose.model("User", UserSchema));

module.exports.createUser = function(newUser, callback) {
  newUser.save(callback);
};

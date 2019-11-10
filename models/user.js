var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

mongoose.connect("mongodb://localhost/login-sys-nodejs", {
  useNewUrlParser: true
});

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
module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  User.findOne(query, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  // Load hash from your password DB.
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    // res === true
    callback(null, isMatch);
  });
};

module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      // Store hash in your password DB.
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

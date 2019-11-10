var express = require("express");
var router = express.Router();
// Handle File Uploads
var multer = require("multer");
var upload = multer({ dest: "./uploads" });
var passport = require("passport");
var localStrategy = require("passport-local").Strategy;

// Importing Model from user
var User = require("../models/user");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("response");
});

router.get("/register", function(req, res, next) {
  res.render("register", { title: "Register" });
});

router.get("/login", function(req, res, next) {
  res.render("login", { title: "Login" });
});

// Passport config
router.post(
  "/login",
  passport.authenticate("local"),
  {
    failureRedirect: "/users/login",
    failureFlash: "Invalid username or password"
  },
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.flash("success", "You are now logged in");
    res.redirect("/");
  }
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Below is a password Strategy
passport.use(
  new LocalStrategy(function(username, password, done) {
    // User is referenced from mongoose.model in user.js file
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "Unknown User" });
      }

      User.comparePassword(password, user.password, () => {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid Password" });
        }
      });
    });
  })
);

// Posting fprm information to server
router.post("/register", upload.single("profileimage"), function(
  req,
  res,
  next
) {
  // Storing all form input data in variables
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Checking if a file has been uploaded or not. If no file, a default file will be provided
  if (req.file) {
    console.log("File uploaded!...");
    var profileimage = req.file.filename;
  } else {
    console.log("No file uploaded");
    var profileimage = "noimage.jpg";
  }

  // Form Validator
  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("email", "Email field is required").notEmpty();
  req.checkBody("email", "Email is not required").isEmail();
  req.checkBody("username", "Username field is required").notEmpty();
  req.checkBody("password", "Password field is required").notEmpty();
  req.checkBody("password2", "Password do not match").equals(req.body.password);

  // Check Errors
  var errors = req.validationErrors();

  // Checking if user entered all fields correctly, if not, errors will be displayed in the DOM of register page
  if (errors) {
    res.render("register", { errors: errors });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileimage
    });
    User.createUser(newUser, (err, user) => {
      if (err) throw err;
      console.log(user);
    });

    // Show a success message for registeration
    req.flash("success", "You have successfully registered!");

    res.location("/");
    res.redirect("/");
  }
});
module.exports = router;

var express = require("express");
var router = express.Router();
// Handle File Uploads
var multer = require("multer");
var upload = multer({ dest: "./uploads" });

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

// Posting fprm information to server
router.post("/register", upload.single("profileimage"), function(
  req,
  res,
  next
) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // if (req.file) {
  //   console.log(req.file);
  // }
});
module.exports = router;

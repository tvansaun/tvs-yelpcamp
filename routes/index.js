const express  = require("express"),
	  router   = express.Router(),
	  passport = require("passport"),
	  User     = require("../models/user");


//ROOT
router.get("/", function(req, res){
	res.render("landing");
});

//REGISTRATION FORM
router.get("/register", function(req, res){
	res.render("register", {page: 'register'});
});

//REGISTER USER
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(error, user){
		if(error){
			return res.render("register", {"error": error.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//LOGIN FORM
router.get("/login", function(req, res){
	res.render("login", {page: 'login'});
});

//LOGIN USER
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});

//LOGOUT USER
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged Out");
	res.redirect("/campgrounds");
});


module.exports = router;
require("dotenv").config();

var express        = require("express"),
	app            = express(),
	bodyParser     = require("body-parser"),
	flash          = require("connect-flash"),
	mongoose       = require("mongoose"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
	Campground     = require("./models/campground"),
	Comment        = require("./models/comment"),
	User           = require("./models/user"),
	seedDB         = require("./seeds");

//REQUIRE ROUTES
var campgroundRoutes  = require("./routes/campgrounds.js"),
	commentRoutes     = require("./routes/comments.js"),
	reviewRoutes      = require("./routes/reviews.js"),
	indexRoutes       = require("./routes/index.js");

var port = process.env.PORT || 8080;

mongoose.connect(process.env.DATABASEURL,  { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
//seedDB();   //seed the DB


//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "tony is a cute kitty",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.useq("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);


app.listen(port, function(){
	console.log("server listening");
});


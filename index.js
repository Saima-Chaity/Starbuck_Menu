var express= require("express");
var methodOverride= require("method-override");
var mongoose= require("mongoose");
var bodyParser= require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var coffee= require("./models/coffee");
var Comment= require("./models/comment");
var drink= require("./models/drink");
var bakery = require("./models/bakery");
var tea = require("./models/tea");
var User = require("./models/user");
var app = express();
var coffeeRoute= require("./routes/coffee");
var commentRoute= require("./routes/comment");
var indexRoute= require("./routes/index");
var drinkRoute= require("./routes/drink");
var teaRoute= require("./routes/tea");
var bakeryRoute= require("./routes/bakery");
var teaCommentRoute= require("./routes/teaComment");
var drinkCommentRoute= require("./routes/drinkComment");
var bakeryCommentRoute= require("./routes/bakeryComment");


// mongoose.Promise = require('bluebird');
// mongoose.connect('mongodb://localhost:27017/campground', {server: { poolSize: 5 }});
mongoose.Promise = Promise;
mongoose.connect("mongodb://recipe:recipe@ds111336.mlab.com:11336/recipeapp");
// var conn = mongoose.connection;
// conn.once('open', function ()
// {
//     console.log('test');
// });

app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//passport configuration
app.use(require("express-session")({
    secret:"coffee-lover",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/" ,indexRoute);
app.use("/coffee", coffeeRoute);
app.use("/bakery", bakeryRoute);
app.use("/tea", teaRoute);
app.use("/drink", drinkRoute);
app.use("/coffee/:id/comment" , commentRoute);
app.use("/tea/:id/comment" , teaCommentRoute);
app.use("/drink/:id/comment" , drinkCommentRoute);
app.use("/bakery/:id/comment" , bakeryCommentRoute);

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Server is running");
});
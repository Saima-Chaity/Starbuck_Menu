var express= require("express");
var router = express.Router();
var User = require ("../models/user");
var passport = require("passport");

//index route
router.get("/", function(req,res){
    res.render("landing");
});

//register
// get route
router.get("/register", function(req,res){
    res.render("register");
});

//post route
router.post("/register", function(req,res){
    var newUser = new User ({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.redirect("/register");
        }
            passport.authenticate("local")(req, res, function(){
                res.redirect("/coffee");
            });
    });
});

//login
//get route
router.get("/login", function(req,res){
    res.render("login");
});

//post route
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/coffee",
        failureredirect: "/login"
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/login");
});

module.exports=router;
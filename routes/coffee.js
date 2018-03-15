var express= require("express");
var router = express.Router();
var coffee = require("../models/coffee");
var middleware = require("../middleware");

//get route
router.get("/", function(req,res){
    coffee.find({}, function(err, foundCoffee){
        if(err){
            console.log(err);
        }else{
            res.render("coffee/menu", {allcoffee:foundCoffee});
        }
    });
});

//post route
router.post("/", middleware.isLoggedIn, function(req,res){
    var title = req.body.Title;
    var image = req.body.Image;
    var price = req.body.Price;
    var description = req.body.Description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCoffee= { Title:title, Image:image, Price:price, Description:description, Author:author };
    coffee.create(newCoffee, function(err, newlyCreatedCoffee){
        if(err){
            console.log(err);
        }else{
            res.redirect("/coffee");
        }
    });
});

//new route
router.get("/new", middleware.isLoggedIn,function(req,res){
    res.render("coffee/new");
});

//show route
router.get("/:id", function(req,res){
    coffee.findById(req.params.id).populate("comments").exec(function(err, showCoffee){
        if(err){
            console.log(err);
        }else{
            res.render("coffee/show",{allcoffee:showCoffee} );
        }
    });
});

//edit route
router.get("/:id/edit", middleware.checkPostOwner,function(req,res){
    coffee.findById(req.params.id, function(err, editedCoffee){
        if(err){
            console.log(err);
        }else{
            res.render("coffee/edit",{allcoffee:editedCoffee} );
        }
    });
});

//update route
router.put("/:id", middleware.checkPostOwner, function(req,res){
    coffee.findByIdAndUpdate(req.params.id, req.body.coffee, function(err, updatedCoffee){
        if(err){
            console.log(err);
        }else{
            res.redirect("/coffee/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:id", middleware.checkPostOwner,function(req,res){
    coffee.findByIdAndRemove(req.params.id, function(err, removedCoffee){
        if(err){
            console.log(err);
        }else{
            res.redirect("/coffee");
        }
    });
});
module.exports=router;
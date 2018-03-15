var express= require("express");
var router = express.Router();
var drink = require("../models/drink");
var middleware = require("../middleware");

//get route
router.get("/", function(req,res){
    drink.find({}, function(err, founddrink){
        if(err){
            console.log(err);
        }else{
            res.render("drink/menu", {drink:founddrink});
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
    var newDrink= { Title:title, Image:image, Price:price, Description:description, Author:author };
    drink.create(newDrink, function(err, newlyCreatedDrink){
        if(err){
            console.log(err);
        }else{
            res.redirect("/drink");
        }
    });
});

//new route
router.get("/new",middleware.isLoggedIn,  function(req,res){
    res.render("drink/new");
});

//show route
router.get("/:id", function(req,res){
    drink.findById(req.params.id).populate("comments").exec( function(err, showdrink){
        if(err){
            console.log(err);
        }else{
            res.render("drink/show",{drink:showdrink} );
        }
    });
});

//edit route
router.get("/:id/edit",middleware.checkDrinkPostOwner,function(req,res){
    drink.findById(req.params.id, function(err, editeddrink){
        if(err){
            console.log(err);
        }else{
            res.render("drink/edit",{drink:editeddrink});
        }
    });
});

//update route
router.put("/:id", middleware.checkDrinkPostOwner, function(req,res){
    drink.findByIdAndUpdate(req.params.id, req.body.drink, function(err, updateddrink){
        if(err){
            console.log(err);
        }else{
            res.redirect("/drink/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:id", middleware.checkDrinkPostOwner,function(req,res){
    drink.findByIdAndRemove(req.params.id, function(err, removeddrink){
        if(err){
            console.log(err);
        }else{
            res.redirect("/drink");
        }
    });
});
module.exports=router;
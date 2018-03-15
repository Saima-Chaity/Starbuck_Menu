var express= require("express");
var router = express.Router();
var bakery = require("../models/bakery");
var middleware = require("../middleware");

//get route
router.get("/", function(req,res){
    bakery.find({}, function(err, foundbakery){
        if(err){
            console.log(err);
        }else{
            res.render("bakery/menu", {bakery:foundbakery});
        }
    });
});

//post route
router.post("/", middleware.isLoggedIn,function(req,res){
    var title = req.body.Title;
    var image = req.body.Image;
    var price = req.body.Price;
    var description = req.body.Description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newbakery= { Title:title, Image:image, Price:price, Description:description, Author:author };
    bakery.create(newbakery, function(err, newlyCreatedbakery){
        if(err){
            console.log(err);
        }else{
            res.redirect("/bakery");
        }
    });
});

//new route
router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("bakery/new");
});

//show route
router.get("/:id", function(req,res){
    bakery.findById(req.params.id).populate("comments").exec( function(err, showbakery){
        if(err){
            console.log(err);
        }else{
            res.render("bakery/show",{bakery:showbakery} );
        }
    });
});

//edit route
router.get("/:id/edit", middleware.checkBakeryPostOwner, function(req,res){
    bakery.findById(req.params.id, function(err, editedbakery){
        if(err){
            console.log(err);
        }else{
            res.render("bakery/edit",{bakery:editedbakery});
        }
    });
});

//update route
router.put("/:id",  middleware.checkBakeryPostOwner,function(req,res){
    bakery.findByIdAndUpdate(req.params.id, req.body.bakery, function(err, updatedbakery){
        if(err){
            console.log(err);
        }else{
            res.redirect("/bakery/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:id", middleware.checkBakeryPostOwner, function(req,res){
    bakery.findByIdAndRemove(req.params.id, function(err, removedbakery){
        if(err){
            console.log(err);
        }else{
            res.redirect("/bakery");
        }
    });
});

module.exports=router;
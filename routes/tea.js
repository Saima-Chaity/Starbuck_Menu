var express= require("express");
var router = express.Router();
var tea = require("../models/tea");
var middleware = require("../middleware");

//get route
router.get("/", function(req,res){
    tea.find({}, function(err, foundtea){
        if(err){
            console.log(err);
        }else{
            res.render("tea/menu", {tea:foundtea});
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
    var newtea= { Title:title, Image:image, Price:price, Description:description,  Author:author};
    tea.create(newtea, function(err, newlyCreatedtea){
        if(err){
            console.log(err);
        }else{
            res.redirect("/tea");
        }
    });
});

//new route
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("tea/new");
});

//show route
router.get("/:id", function(req,res){
    tea.findById(req.params.id).populate("comments").exec(function(err, showtea){
        if(err){
            console.log(err);
        }else{
            res.render("tea/show",{tea:showtea} );
        }
    });
});

//edit route
router.get("/:id/edit",middleware.checkTeaPostOwner, function(req,res){
    tea.findById(req.params.id, function(err, editedtea){
        if(err){
            console.log(err);
        }else{
            res.render("tea/edit",{tea:editedtea});
        }
    });
});

//update route
router.put("/:id", middleware.checkTeaPostOwner,  function(req,res){
    tea.findByIdAndUpdate(req.params.id, req.body.tea, function(err, updatedtea){
        if(err){
            console.log(err);
        }else{
            res.redirect("/tea/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:id",middleware.checkTeaPostOwner,function(req,res){
    tea.findByIdAndRemove(req.params.id, function(err, removedtea){
        if(err){
            console.log(err);
        }else{
            res.redirect("/tea");
        }
    });
});
module.exports=router;
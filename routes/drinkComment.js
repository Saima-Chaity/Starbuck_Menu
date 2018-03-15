var express= require("express");
var router = express.Router({mergeParams: true});
var drink = require("../models/drink");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//new route
router.get("/new", middleware.isLoggedIn, function(req,res){
    drink.findById(req.params.id, function(err, alldrink) {
        if(err){
            res.redirect("back");
        }else{
            res.render("comment/newDrink", {drink:alldrink});
        }
    });
});

//post route
router.post("/", middleware.isLoggedIn, function(req,res){
    drink.findById(req.params.id, function(err, drink){
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    comment.Author.id = req.user._id;
                    comment.Author.username = req.user.username;
                    comment.save();
                    drink.comments.push(comment);
                    drink.save();
                    res.redirect("/drink/"+ drink._id);
                }
            });
        }
    });
});

//edit route
router.get("/:comment_id/edit",middleware.checkCommentOwner, function(req,res){
    Comment.findById(req.params.comment_id, function(err, editedComment){
        if(err){
            console.log(err);
        }else{
            res.render("comment/editDrink", {drink_id: req.params.id, comment:editedComment});
        }
    });
});

//update route
router.put("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateddrink){
        if(err){
            console.log(err);
        }else{
            res.redirect("/drink/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removeddrink){
        if(err){
            console.log(err);
        }else{
            res.redirect("/drink/" + req.params.id );
        }
    });
});
module.exports=router;
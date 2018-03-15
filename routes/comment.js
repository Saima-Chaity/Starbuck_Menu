var express= require("express");
var router = express.Router({mergeParams: true});
var coffee = require("../models/coffee");
var Comment = require("../models/comment");
var middleware = require("../middleware");

 //new route
router.get("/new", middleware.isLoggedIn, function(req,res){
    coffee.findById(req.params.id, function(err, allcoffee) {
        if(err){
            res.redirect("back");
        }else{
            res.render("comment/new", {allcoffee:allcoffee});
        }
    });
});

//post route
router.post("/", middleware.isLoggedIn, function(req,res){
    coffee.findById(req.params.id, function(err, coffee){
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
                    coffee.comments.push(comment);
                    coffee.save();
                    res.redirect("/coffee/"+ coffee._id);
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
            res.render("comment/edit", {coffee_id: req.params.id, comment:editedComment});
        }
    });
});

//update route
router.put("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
        }else{
            res.redirect("/coffee/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedCoffee){
        if(err){
            console.log(err);
        }else{
            res.redirect("/coffee/" + req.params.id );
        }
    });
});
module.exports=router;
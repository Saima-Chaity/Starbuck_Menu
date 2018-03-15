var express= require("express");
var router = express.Router({mergeParams: true});
var bakery = require("../models/bakery");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//new route
router.get("/new", middleware.isLoggedIn, function(req,res){
    bakery.findById(req.params.id, function(err, allbakery) {
        if(err){
            res.redirect("back");
        }else{
            console.log("hi");
            res.render("comment/newBakery", {bakery:allbakery});
        }
    });
});

//post route
router.post("/", middleware.isLoggedIn, function(req,res){
    bakery.findById(req.params.id, function(err, bakery){
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
                    bakery.comments.push(comment);
                    bakery.save();
                    res.redirect("/bakery/"+ bakery._id);
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
            res.render("comment/editBakery", {bakery_id: req.params.id, comment:editedComment});
        }
    });
});

//update route
router.put("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedbakery){
        if(err){
            console.log(err);
        }else{
            res.redirect("/bakery/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedbakery){
        if(err){
            console.log(err);
        }else{
            res.redirect("/bakery/" + req.params.id );
        }
    });
});

module.exports=router;
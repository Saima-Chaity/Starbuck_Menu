var express= require("express");
var router = express.Router({mergeParams: true});
var tea = require("../models/tea");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//new route
router.get("/new", middleware.isLoggedIn, function(req,res){
    tea.findById(req.params.id, function(err, alltea) {
        if(err){
            res.redirect("back");
        }else{
            console.log("hi");
            res.render("comment/newTea", {tea:alltea});
        }
    });
});

//post route
router.post("/", middleware.isLoggedIn, function(req,res){
    tea.findById(req.params.id, function(err, tea){
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
                    tea.comments.push(comment);
                    tea.save();
                    res.redirect("/tea/"+ tea._id);
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
            res.render("comment/editTea", {tea_id: req.params.id, comment:editedComment});
        }
    });
});

//update route
router.put("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedtea){
        if(err){
            console.log(err);
        }else{
            res.redirect("/tea/" + req.params.id);
        }
    });
});

//delete route
router.delete("/:comment_id", middleware.checkCommentOwner, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedtea){
        if(err){
            console.log(err);
        }else{
            res.redirect("/tea/" + req.params.id );
        }
    });
});

module.exports=router;
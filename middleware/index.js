var coffee= require("../models/coffee");
var drink= require("../models/drink");
var bakery = require("../models/bakery");
var tea = require("../models/tea");
var Comment= require("../models/comment");
var middleware ={};

//IsLoggedIn
middleware.isLoggedIn = function (req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

//CheckCoffeePostOwner
middleware.checkPostOwner = function (req, res,next){
     if(req.isAuthenticated()){
        coffee.findById(req.params.id, function(err, editedCoffee){
            if(err){
                res.redirect("back");
            }else{
                if(editedCoffee.Author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
};

//CheckteaPostOwner
middleware.checkTeaPostOwner = function (req, res,next){
     if(req.isAuthenticated()){
        tea.findById(req.params.id, function(err, editedtea){
            if(err){
                res.redirect("back");
            }else{
                if(editedtea.Author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
};

//CheckDrinkPostOwner
middleware.checkDrinkPostOwner = function (req, res,next){
     if(req.isAuthenticated()){
        drink.findById(req.params.id, function(err, editeddrink){
            if(err){
                res.redirect("back");
            }else{
                if(editeddrink.Author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
};

//CheckBakeryPostOwner
middleware.checkBakeryPostOwner = function (req, res,next){
     if(req.isAuthenticated()){
        bakery.findById(req.params.id, function(err, editedbakery){
            if(err){
                res.redirect("back");
            }else{
                if(editedbakery.Author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
};

//CheckCommentOwner
middleware.checkCommentOwner = function(req, res,next){
     if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, editedComment){
            if(err){
                res.redirect("back");
            }else{
                if(editedComment.Author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
};
module.exports=middleware;
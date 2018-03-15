var mongoose= require("mongoose");

var drinkSchema = new mongoose.Schema({
    Title: String,
    Image: String,
    Price:String,
    Description: String,
    created: {type: Date, default: Date.now},
    Author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments:
    [
        {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
        }
    ]
});
module.exports = mongoose.model("drink", drinkSchema);
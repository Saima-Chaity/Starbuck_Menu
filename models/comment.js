var mongoose= require("mongoose");

var commentSchema = new mongoose.Schema({
    Text: String,
    created: {type: Date, default: Date.now},
    Author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports = mongoose.model("Comment", commentSchema);
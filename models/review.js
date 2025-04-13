// require mongooe
const { number } = require('joi');
const mongoose = require('mongoose'); //1
// to avoid writing mongoose.schema
const Schema=mongoose.Schema;
// now make your schema
const reviewSchema=new Schema({
    comment:String,
    rating:{
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});
module.exports = mongoose.model("Review", reviewSchema);
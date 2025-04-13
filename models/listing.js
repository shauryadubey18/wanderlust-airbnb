// require mongooe
const mongoose = require('mongoose'); //1
// to avoid writing mongoose.schema
const Schema=mongoose.Schema;
// requiring review schema here 
const Review=require("./review.js");
// now make your schema
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v
        }
    },
    
    price:Number,
    location:String,
    country:String,
    reviews :[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

})
// we have to dle all the reviews associated with a perticular listing so to hande that we wil do the following code]
// create post mongoose middleware
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
    }
})

// create the model and export the model
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;
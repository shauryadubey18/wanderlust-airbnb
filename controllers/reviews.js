const Listing=require("../models/listing")
const Review=require("../models/review")
module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("sucess","New review created");
    //console.log("review saved");
    res.redirect(`/listings/${listing._id}`);
} 
module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    // we r using pull operation here to detele review of that if the pull operation pulls a value from all  values
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess","review deleted");
    res.redirect(`/listings/${id}`);
}
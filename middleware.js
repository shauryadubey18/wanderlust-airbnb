// requiring the listing
const Listing=require("./models/listing");
// requiring review model
const Review=require("./models/review.js");
module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.path,"..",req.originalUrl)
    if(!req.isAuthenticated()){
        // to redirect to original requested page
        req.session.redirectUrl=req.originalUrl;
        req.flash("error" , "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    
    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    //to avoid unortharised people from updating listing
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you cant have acess to this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isreviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    //to avoid unortharised people from updating listing
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you cant have acess to this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
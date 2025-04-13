const Listing=require("../models/listing")
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings}); // now require path
}
module.exports.renderNewForm=(req,res)=>{ 
    res.render("./listings/new.ejs");
};
module.exports.showListings=async (req,res)=>{
    // extract id first
    let {id}=req.params; // now we have to do url encoding so that our req parameter can be acessed 
   // console.log("showing");
    const listing=await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings")
    }
    res.render("./listings/show.ejs",{listing});
};
module.exports.createListing=async (req,res,next)=>{
    // if the listing is not present in the body vlidate using joi
    let result=listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
         //console.log(listing);
    const newListing= new Listing(req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    //for flash mesage
    req.flash("sucess","New listing created");
   res.redirect("/listings");

}
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params; // now we have to do url encoding so that our req parameter can be acessed 
    // console.log("showing");
     const listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings")
    }
     res.render("./listings/edit.ejs",{listing});
};
module.exports.updateListing=async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"send a valid data for listing");
    }
    let {id}=req.params;
    //to avoid unortharised people from updating listing  did using middleware
    // let listing=await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //     req.flash("error","you cant have acess to this listing");
    //     return res.redirect(`/listings/${id}`);
    // }
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("sucess","Listing updated");
    //console.log("Image:", id.image);
    res.redirect(`/listings/${id}`)
};
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedlisting=await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("sucess","Listing deleted");
    res.redirect("/listings");
}
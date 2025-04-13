const express=require("express");//1
const router=express.Router();//2
// requiring wrapAsync
const wrapAsync=require("../utils/wrapAsync.js");
// require listing schema
const {listingSchema,reviewSchema}=require("../schema.js");
// requiring express error for custom errors
const ExpressError=require("../utils/ExpressError.js");
// requiring the listing
const Listing=require("../models/listing.js"); //9
// to check if the user is already logged in before creating a new listing 
const {isLoggedIn, isOwner}=require("../middleware.js");

// reuiring controller of listing
const listingController=require("../controllers/listings.js");
const { index } = require("../controllers/listings.js");
//reuiring multer and upload 
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })
//14 create new listing , new route
router.get("/new",isLoggedIn,listingController.renderNewForm);
//12 show route
router.get("/:id",wrapAsync(listingController.showListings))
//15 now we will make our post reuest for create new listing basically we will add our data and redirect to our listing page
router.post("/",isLoggedIn,upload.single('listing[image]'),
    wrapAsync(async (req,res,next)=>{
        // if the listing is not present in the body vlidate using joi
        let result=listingSchema.validate(req.body);
        console.log(result);
        if(result.error){
            throw new ExpressError(400,result.error);
        }
             //console.log(listing);
    // for image of our listing
        let url=req.file.path;
        let filename=req.file.filename;
        console.log(url, "....", filename);
        const newListing= new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url,filename};
        await newListing.save();
        //for flash mesage
        req.flash("sucess","New listing created");
       res.redirect("/listings");
    
    }));
// router.post("/",upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })
// edit route 16
router.get("/:id/edit",isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));
// update route
router.put("/:id",isLoggedIn,
    isOwner,upload.single('listing[image]')
    ,wrapAsync(listingController.updateListing))
// delete route
router.delete("/:id",isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing))
// now we will set index route we will show alll listings here 10
router.get("/",wrapAsync(listingController.index))
module.exports=router;
// requiring our env fole
if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}

const express=require("express");//1
const app=express();//2
const mongoose = require('mongoose');//3
// requiring the listing
const Listing=require("./models/listing.js"); //9
// requiring wrapAsync
const wrapAsync=require("./utils/wrapAsync.js");
// requiring express error for custom errors
const ExpressError=require("./utils/ExpressError.js");
// require listing schema
const {listingSchema,reviewSchema}=require("./schema.js");
// requiring review model
const Review=require("./models/review.js");
// now we will require our router for listings
const listings=require("./routes/listing.js");
// now we will require our router for user
const userRouter=require("./routes/user.js");
//requiring express seeions (cookie)
const session=require("express-session");
//requiring flash
const flash = require('connect-flash');
// require ejs mate
const ejsMate=require("ejs-mate");
//connecting connect-mongo
const MongoStore = require('connect-mongo');
// requiring passport
const passport=require("passport");
//require passport local
const LocalStrategy=require("passport-local");
//reuire user model
const User = require('./models/user.js');
app.engine("ejs",ejsMate);
// requiring path 11  to setup ejs
const path=require("path");
// reuiring controller of listing
const reviewController=require("./controllers/reviews.js");
// to use static files that means the css files
app.use(express.static(path.join(__dirname,"/public")));
//13 req parameter can be acessed 
app.use(express.urlencoded({extended:true}));

// to use method over ride 
const methodOverride = require('method-override');
const { isLoggedIn, isreviewAuthor } = require("./middleware.js");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
// making url for new db
//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";//6
const dbUrl=process.env.ATLASDB_URL;
main().then(()=>{   //8
    console.log("connected to db")
}).catch(err=>{
    console.log(err);
})
async function main() {//7
    await mongoose.connect(dbUrl);// passing url
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }
// we have to set view engine and also for ejs we have to se directory
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"mysupersecretcode"
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log("error in mongo session store",err);
})
// defining options for sessions
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
};
// sending response
// app.get('/', (req, res) => {//5
//     res.send('Hello user this page is under developing phase currently! feel free to explore other services of the website ');
// });

// to use session 
app.use(session(sessionOptions));
// to use flash
app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//creating middleware for flash
app.use((req,res,next)=>{
    res.locals.sucess=req.flash("sucess");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

//route for demouser
// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"drishtiratta2@getMaxListeners.com",
//         username:"delta-student"
//     });
//     //to register the user
//     let registeredUser=await User.register(fakeUser,"helloword");
//     res.send(registeredUser);
// })

// creating validate functions for reviews
const validatereview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join("'");
        throw new ErrorExpress(400,errMsg);
    }else{
        next();
    }
}
// now we will use listings
app.use("/listings",listings);
app.use("/",userRouter);



// adding reviews review route
// post route for reviews
app.post("/listings/:id/reviews",
    isLoggedIn,
    validatereview,wrapAsync(reviewController.createReview));
// creating delete route for reviews
app.delete("/listings/:id/reviews/:reviewId",
    isLoggedIn,
    isreviewAuthor,
    wrapAsync(reviewController.deleteReview));

// we will try to create our new model   
// app.get("/testListing",async (req,res)=>{//8
//     // access the model(listinb) and create the new docs for this you will have to require the listing in this file
//     let sampleListing=new Listing({
//         title: "my sweet home",
//         description:"my villa near beach",
//         price:6000,
//         location:"bombay",
//         country:"india"
//     })
//     await sampleListing.save();
//     console.log("sampleListing saved");
//     res.send("sucessful")
// });

// handeling request that dosnt exist in our website
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})
// handeling invalid value error 
app.use((err,req,res,next) => {
    let {statuscode=500,message="something went wrong"}=err;
    res.render("error.ejs",{message});
    //res.status(statuscode).send(message);
  });
// make app(espress instance) listen  starting the server start it by nodemon app.js
app.listen(8080,()=>{//4
    console.log("app is listening on port 8080");
});
// sending response
app.get('/', (req, res) => {//5
    res.send('Hello World!');
  });


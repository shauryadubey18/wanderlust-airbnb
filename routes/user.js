const express=require("express");//1
const router=express.Router();//2
//reuire user model
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
// reuiring controller of user
const userController=require("../controllers/user.js");
//to register user
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
router.post("/signup",wrapAsync(userController.signup));
// to let user login 
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
});
// handeling post request for login
router.post("/login",saveRedirectUrl
    ,passport.authenticate("local",{failureRedirect:"/login", failureFlash:true,}),async(req,res)=>{
    req.flash("sucess","welcome to wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

})
router.get("/logout",(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucess", "logged out sucessfully!");
        res.redirect("/listings");
    })
})


module.exports=router;
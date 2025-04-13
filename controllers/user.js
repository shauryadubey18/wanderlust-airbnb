//reuire user model
const User = require('../models/user.js');
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        // to automatically login our user as soon as they signup
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("sucess","user registered sucessfully");
        res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");

    }
   
};
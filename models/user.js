const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
    // passport local mongoose will add username and password field by its owh along with salting and hashing 
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
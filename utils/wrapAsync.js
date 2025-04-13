// we r making this to handle our errors 
module.exports=(fn)=>{
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}
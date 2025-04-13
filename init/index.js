const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";//6
main().then(()=>{   //8
    console.log("connected to db")
}).catch(err=>{
    console.log(err);
})
async function main() {//7
    await mongoose.connect(MONGO_URL);// passing url
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }
  const initDb = async()=>{
    await Listing.deleteMany({});
    //to avoid adding owner in every listing individually we can do this
    initData.data=initData.data.map((obj)=>({
      ...obj,
      owner:"6722656fc82524729e65b042"
    }))
    await Listing.insertMany(initData.data);
    console.log("init data was saved");
  }
  initDb();
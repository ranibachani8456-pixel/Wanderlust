const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync.js");
const expressErrors=require("./utils/expressErrors.js");
const {listingSchema}=require("./schema.js");
const Review = require("./models/review");
const {reviewSchema}=require("./schema.js");

const listings=require("./routes/listing.js");
const review = require("./routes/reviews.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"))
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const MONGO_URL="mongodb://127.0.0.1:27017/airbnb";

main().then(()=>{
    console.log("connected to DB");
}).catch(err=>{
    console.log(err);
})

async function main(){
  await mongoose.connect(MONGO_URL);  
}

app.get("/",(req,res)=>{
    res.send("Hi, I'm Root");
})

//validate review added to reviews.js and listing.js

//restructuring the routes to make it more readable and maintainable
app.use("/listings",listings);


//review routes
app.use("/listings",review);


//show reviews route


//page not found response
//dont change splate
app.all("/{*splat}", (req, res, next) => {
    next(new expressErrors("Page Not Found", 404));
});

//error handling middleware-
app.use((err,req,res,next)=>{
    let {message="Something went wrong",statusCode=500}=err;
    // res.render("listings/error.ejs",{err});
    // res.status(statusCode).send(message);
    res.status(statusCode).render("./listings/error.ejs",{err});
})

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
})
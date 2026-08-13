const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAsync.js");
const expressErrors=require("./utils/expressErrors.js");
const session=require("express-session");
const flash=require("connect-flash");

const {listingSchema}=require("./schema.js");
const Review = require("./models/review");
const {reviewSchema}=require("./schema.js");


//before routes we need to use flash

app.use(session({
    secret: "thisisasecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: new Date(Date.now() + 7*24*60*60*1000), //cookie will expire after 7 days
        //cookie will not expire until browser is closed so its bad
        maxAge: 7*24*60*60*1000, //7 days in milliseconds
        httpOnly: true, //cookie cannot be accessed by client side javascript
    }
}));

//app.use(session(sessionOptions));

//now if we see connect.sid in the cookies, it means that the session is working and we can store data in the session.


app.get("/",(req,res)=>{
    res.send("Hi, I'm Root");
})

app.use(flash());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    // console.log(res.locals.success);
    // console.log(res.locals.error);
    res.locals.error=req.flash("error");
    next();
    //we'll add success message in index.ejs bcs it's getting redirected to index.ejs after creating a new listing
})

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
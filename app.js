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

//saare validations ko we want to convert to middleware form
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
            let errMsg=error.details.map(el=>el.message).join(",");
        throw new expressErrors(errMsg,400);
    }
    else{
        next();
    }
}

//validate review middleware
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el=>el.message).join(",");
        throw new expressErrors(errMsg,400);
    }
    else{
        next();
    }
}




// app.get("/testListing",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"my New Villa",
//         description:"By the beach",
//         price:20000,
//         location:"Goa",
//         country:"India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfull");
// })

//index route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings})
    }));

// app.get("/listings", async (req, res) => {
//     const allListings = await Listing.find({});

//     console.log(allListings[0].image);
//     console.log(typeof allListings[0].image);

//     res.render("listings/index.ejs", { allListings });
// });

//new route
app.get("/listings/new",wrapAsync(async(req,res)=>{
    res.render("./listings/new.ejs")
}))


//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    //populate isliye taki sirf id na aaye but details bhi aaye
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing})
}));

//create route
// using try catch here first
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    
    // if(!req.body.listing) throw new expressErrors("Invalid Listing Data",400);
// let {title, description, image, price, country, location}=req.body;


   const newListing=new Listing(req.body.listing);

   //yeh baar baar nahi kar dsakte isliye we'll use npm package - joi for validation
   //and then joi ki help se we define server side schema in schema.js file and then we can use that schema to validate the data before saving it to the database.

//    if(!newListing.title) throw new expressErrors("missing Title",400);
//    if(!newListing.description) throw new expressErrors("missing Description",400);
//    if(!newListing.price) throw new expressErrors("missing Price",400);
//    if(!newListing.country) throw new expressErrors("missing Country",400);
//    if(!newListing.location) throw new expressErrors("missing Location",400);

   await newListing.save();
   res.redirect("/listings");


//     try{
//         // let {title, description, image, price, country, location}=req.body;
//    const newListing=new Listing(req.body.listing);
//    await newListing.save();
//    res.redirect("/listings");
//     }catch(err){
//         next(err);
//     }
}))

//edit route 
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing})
}))

//update route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    //validate listing daal diya hai
    // if(!req.body.listing) throw new expressErrors("Invalid Listing Data",400);
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect(`/listings/${id}`);
}))

//delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
}));

//Reviews routeus- 
//Post route - reviews ko listings ke saath hi access karenge to direct post
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res)=>{
    let id=req.params.id;
    const listing = await Listing.findById(id);
    // You can now add the review to the listing and save it
    // Example:
    // const review = new Review(req.body.review);
    // listing.reviews.push(review);
    // await listing.save();
    // res.redirect(`/listings/${id}`);
    let newReview=new Review(req.body.review);
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    console.log("review saved")
    res.redirect(`/listings/${id}`);
}));

//review delete route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    // await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    res.redirect(`/listings/${id}`);
}));


//show reviews route


//page not found response
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
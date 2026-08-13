const express=require("express");
const router=express.Router();

//requiring all middlewares amd models
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema}=require("../schema.js");
const expressErrors=require("../utils/expressErrors.js");
const Listing=require("../models/listing.js");



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

//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings})
    }));

// router.get("/listings", async (req, res) => {
//     const allListings = await Listing.find({});

//     console.log(allListings[0].image);
//     console.log(typeof allListings[0].image);

//     res.render("listings/index.ejs", { allListings });
// });

//new route
router.get("/new",wrapAsync(async(req,res)=>{
    res.render("./listings/new.ejs")
}))


//show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    //populate isliye taki sirf id na aaye but details bhi aaye
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Cannot find that listing");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing})
}));

//create route
// using try catch here first
router.post("/",validateListing,wrapAsync(async(req,res,next)=>{
    
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
   //creating flash
   req.flash("success","Successfully made a new listing");
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
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot find that listing");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing})
}))

//update route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    //validate listing daal diya hai
    // if(!req.body.listing) throw new expressErrors("Invalid Listing Data",400);
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Successfully updated the listing");
    res.redirect(`/listings/${id}`);
}))

//delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Successfully deleted the listing");
    res.redirect("/listings")
}));

module.exports=router;
const express=require("express");
const router=express.Router();

//requiring all middlewares amd models
const wrapAsync=require("../utils/wrapAsync.js");
const expressErrors=require("../utils/expressErrors.js");
const {listingSchema}=require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review");
const {reviewSchema}=require("../schema.js");

//validate model
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


//Reviews routeus- 
//Post route - reviews ko listings ke saath hi access karenge to direct post
router.post("/:id/reviews", validateReview, wrapAsync(async (req,res)=>{
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
    req.flash("success","Successfully made a new review");
    res.redirect(`/listings/${id}`);
}));

//review delete route
router.delete("/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    //arrage se jake delete
    //we use mongo ka pull operator to remove the reviewId from the reviews array in the listing document
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash("success","Successfully deleted the review");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;



